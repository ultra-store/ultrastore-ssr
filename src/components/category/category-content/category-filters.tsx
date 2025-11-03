'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter, FilterPopup, FiltersSection, Multiselect, Range, Toggle } from '@/components/ui/filter';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';

import type { FilterData, FilterSection, Product } from '@/shared/types';

interface CategoryFiltersProps {
  filters: FilterData
  products: Product[]
  onApplyingChange?: (active: boolean) => void
}

const DEBOUNCE_DELAY = 500; // delay to batch multiple filter changes and reduce server requests

export const CategoryFilters = ({ filters, onApplyingChange }: CategoryFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isApplying, setIsApplying] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Disable filters during actual request
  const [localSelections, setLocalSelections] = useState<Record<string, string[]>>({});
  const [localInStock, setLocalInStock] = useState<boolean | null>(null);
  const [localOnSale, setLocalOnSale] = useState<boolean | null>(null);
  const prevSearchParamsRef = useRef<string | null>(null);

  // Проверяем, нужно ли показывать фильтр по цене
  const shouldShowPriceFilter = useMemo(() => {
    return filters.priceRange.min !== filters.priceRange.max;
  }, [filters.priceRange.min, filters.priceRange.max]);

  // Показываем фильтр наличия всегда, если он включен в настройках категории
  const shouldShowStockFilter = useMemo(() => {
    return filters.settings?.stockFilterEnabled === true;
  }, [filters.settings?.stockFilterEnabled]);

  // Показываем фильтр скидок всегда, если он включен в настройках категории
  const shouldShowSaleFilter = useMemo(() => {
    return filters.settings?.saleFilterEnabled === true;
  }, [filters.settings?.saleFilterEnabled]);

  // Get initial range value from URL params
  const initialRangeValue = useMemo<[number, number]>(() => {
    const minParam = searchParams?.get('min_price');
    const maxParam = searchParams?.get('max_price');

    return [
      minParam ? Number(minParam) : filters.priceRange.currentMin,
      maxParam ? Number(maxParam) : filters.priceRange.currentMax,
    ];
  }, [searchParams, filters.priceRange.currentMin, filters.priceRange.currentMax]);

  // Local state for immediate UI updates
  const [rangeValue, setRangeValue] = useState<[number, number]>(initialRangeValue);

  // Sync local state when URL params change (from outside, e.g., back button)
  useEffect(() => {
    setRangeValue(initialRangeValue);
  }, [initialRangeValue]);

  // Track URL params changes to reset overlay and enable filters when request completes
  useEffect(() => {
    const currentParams = searchParams?.toString() || '';
    const prevParams = prevSearchParamsRef.current;

    // If params changed and we were loading, request completed - re-enable filters
    if (prevParams !== null && prevParams !== currentParams && (isApplying || isLoading)) {
      setIsApplying(false);
      setIsLoading(false);
      onApplyingChange?.(false);
      // Clear local optimistic states once URL reflects new state
      setLocalSelections({});
      setLocalInStock(null);
      setLocalOnSale(null);
    }

    prevSearchParamsRef.current = currentParams;
  }, [searchParams, isApplying, isLoading, onApplyingChange]);

  // Refs for debounce timeouts
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filterDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to accumulate all pending filter updates
  const pendingUpdatesRef = useRef<((params: URLSearchParams) => void)[]>([]);

  // Debounced URL update function for price range
  const updateUrlParams = useCallback((value: [number, number]) => {
    const params = new URLSearchParams(searchParams?.toString());

    params.set('min_price', String(value[0]));
    params.set('max_price', String(value[1]));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Debounced function to update URL with new params object
  // All filter updates are batched together and applied after debounce delay
  const updateUrlWithParams = useCallback((updateFn: (params: URLSearchParams) => void) => {
    // Add this update to the pending updates queue
    pendingUpdatesRef.current.push(updateFn);

    // Clear existing timeout
    if (filterDebounceTimeoutRef.current) {
      clearTimeout(filterDebounceTimeoutRef.current);
    }

    // Set new timeout for URL update
    filterDebounceTimeoutRef.current = setTimeout(() => {
      // Start with current URL params
      const currentParams = new URLSearchParams(searchParams?.toString());

      // Apply all pending updates sequentially to the same params object
      // This ensures all updates are applied correctly, even if they modify different params
      pendingUpdatesRef.current.forEach((updateFn) => {
        updateFn(currentParams);
      });

      // Clear pending updates
      pendingUpdatesRef.current = [];

      // Disable filters now, when request is actually sent (after debounce)
      setIsLoading(true);
      onApplyingChange?.(true);

      router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }, DEBOUNCE_DELAY);
  }, [pathname, router, searchParams, onApplyingChange]);

  // Handle price range change with debouncing
  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    // Update local state immediately for responsive UI
    setRangeValue(value);
    // Don't set isApplying/isLoading here - only after debounce

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for URL update
    debounceTimeoutRef.current = setTimeout(() => {
      // Disable filters now, when request is actually sent (after debounce)
      setIsLoading(true);
      onApplyingChange?.(true);

      updateUrlParams(value);
      // Note: filters will be re-enabled when searchParams actually changes
    }, DEBOUNCE_DELAY);
  }, [updateUrlParams, onApplyingChange]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (filterDebounceTimeoutRef.current) {
        clearTimeout(filterDebounceTimeoutRef.current);
      }
      // Clear pending updates on unmount
      pendingUpdatesRef.current = [];
    };
  }, []);

  // Get selected values for attribute filters from URL params
  const getSelectedValues = useCallback((paramName: string): string[] => {
    // Prefer local optimistic selection if present
    if (localSelections[paramName]) {
      return localSelections[paramName];
    }
    const param = searchParams?.get(paramName);

    if (!param) {
      return [];
    }

    return param.split(',').filter(Boolean);
  }, [searchParams, localSelections]);

  // Handle attribute filter change with debounce
  const handleAttributeChange = useCallback((paramName: string, selectedValues: string[]) => {
    // Optimistically update local selection for immediate checkbox state
    setLocalSelections((prev) => ({
      ...prev,
      [paramName]: selectedValues,
    }));
    // Don't set isApplying/isLoading here - only after debounce

    // Debounce URL update - capture values in closure
    const param = paramName;
    const values = selectedValues;

    updateUrlWithParams((params) => {
      if (values.length === 0) {
        params.delete(param);
      } else {
        params.set(param, values.join(','));
      }
    });
    // Note: filters will be disabled after debounce, re-enabled when searchParams changes
  }, [updateUrlWithParams]);

  const filtersContent = (
    <FiltersSection>
      {/* Price Range Filter */}
      {shouldShowPriceFilter && (
        <Filter label="Цена" collapsible defaultOpen>
          <Range
            min={filters.priceRange.min}
            max={filters.priceRange.max}
            value={rangeValue}
            onChange={handlePriceRangeChange}
            unit="₽"
            disabled={isLoading}
          />
        </Filter>
      )}

      {/* Availability Toggle */}
      {shouldShowStockFilter && (
        <Filter label="В наличии" collapsible={false} oneline>
          <Toggle
            isEnabled={localInStock ?? (searchParams?.get('in_stock') === '1')}
            disabled={isLoading}
            onToggle={() => {
              // Capture current state to compute next state
              const currentValue = localInStock ?? (searchParams?.get('in_stock') === '1');
              const next = !currentValue;

              // Optimistically flip local toggle state
              setLocalInStock(next);

              // Don't set isApplying/isLoading here - only after debounce

              // Debounce URL update - use captured next value
              // Capture next value in closure to ensure it's applied correctly
              const nextValue = next;

              updateUrlWithParams((params) => {
                if (nextValue) {
                  params.set('in_stock', '1');
                } else {
                  params.delete('in_stock');
                }
              });
            }}
            paramName="in_stock"
          />
        </Filter>
      )}

      {/* Sale Toggle */}
      {shouldShowSaleFilter && (
        <Filter label="Со скидкой" collapsible={false} oneline>
          <Toggle
            isEnabled={localOnSale ?? (searchParams?.get('on_sale') === '1')}
            disabled={isLoading}
            onToggle={() => {
              // Capture current state to compute next state
              const currentValue = localOnSale ?? (searchParams?.get('on_sale') === '1');
              const next = !currentValue;

              // Optimistically flip local toggle state
              setLocalOnSale(next);

              // Don't set isApplying/isLoading here - only after debounce

              // Debounce URL update - use captured next value
              // Capture next value in closure to ensure it's applied correctly
              const nextValue = next;

              updateUrlWithParams((params) => {
                if (nextValue) {
                  params.set('on_sale', '1');
                } else {
                  params.delete('on_sale');
                }
              });
            }}
            paramName="on_sale"
          />
        </Filter>
      )}

      {/* Attribute Filters from WooCommerce */}
      {filters.sections && filters.sections.length > 0 && filters.sections.map((section: FilterSection) => {
        // Skip price and toggle types as they're handled separately
        if (section.type === 'price' || section.type === 'toggle') {
          return null;
        }

        // Build param name: pa_<attribute_id>
        // If id already starts with pa_, use it as is, otherwise prepend pa_
        const paramName = section.id.startsWith('pa_') ? section.id : `pa_${section.id}`;
        const selectedValues = getSelectedValues(paramName);

        // Show all filters immediately, regardless of available options
        // API now returns all possible filters from all products in category
        // Options with count = 0 are still shown to maintain filter visibility

        return (
          <Filter
            key={section.id}
            label={section.title}
            collapsible
            defaultOpen
          >
            <Multiselect
              options={section.options || []}
              selectedValues={selectedValues}
              onSelectionChange={(values) => handleAttributeChange(paramName, values)}
              type={section.type === 'color' ? 'color' : 'checkbox'}
              paramName={paramName}
              disabled={isLoading}
            />
          </Filter>
        );
      })}
    </FiltersSection>
  );

  return filtersContent;
};

// Export filter content component for popup
export const CategoryFiltersPopup = ({ filters, products, onApplyingChange }: CategoryFiltersProps) => {
  const { isOpen: isFilterOpen, setIsOpen: setFilterOpen } = useFilterPopup();

  // Reuse the same logic from CategoryFilters
  const filtersContent = <CategoryFilters filters={filters} products={products} onApplyingChange={onApplyingChange} />;

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  return (
    <FilterPopup isOpen={isFilterOpen} onClose={handleCloseFilter}>
      {filtersContent}
    </FilterPopup>
  );
};
