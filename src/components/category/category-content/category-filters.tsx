'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter, FilterPopup, FiltersSection, Multiselect, Range, Toggle } from '@/components/ui/filter';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';

import type { FilterData, FilterSection, Product } from '@/shared/types';

interface CategoryFiltersProps {
  filters: FilterData
  products: Product[]
}

const DEBOUNCE_DELAY = 500; // 500ms delay before updating URL

export const CategoryFilters = ({ filters, products }: CategoryFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen: isFilterOpen, setIsOpen: setFilterOpen } = useFilterPopup();

  // Проверяем, нужно ли показывать фильтр по цене
  const shouldShowPriceFilter = useMemo(() => {
    return filters.priceRange.min !== filters.priceRange.max;
  }, [filters.priceRange.min, filters.priceRange.max]);

  // Проверяем, нужно ли показывать фильтр наличия
  // Фильтр показывается, если:
  // 1. Фильтр уже включен (чтобы можно было его отключить)
  // 2. Или есть товары не в наличии в исходной коллекции (без учета фильтра по наличию)
  const shouldShowStockFilter = useMemo(() => {
    const isStockFilterActive = searchParams?.get('in_stock') === '1';

    // Если фильтр включен, показываем его всегда, чтобы можно было отключить
    if (isStockFilterActive) {
      return true;
    }

    // Если фильтр не включен, проверяем наличие товаров не в наличии
    // Важно: проверяем исходную коллекцию, а не отфильтрованную
    // Но поскольку мы не имеем доступа к исходной коллекции,
    // используем факт наличия фильтра в URL как индикатор
    // Если фильтр был включен ранее и отключен, то были товары не в наличии
    // Для более точной проверки нужно проверять products без учета in_stock фильтра
    return products.some((product) => product.in_stock === false);
  }, [products, searchParams]);

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

  // Ref for debounce timeout
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced URL update function
  const updateUrlParams = useCallback((value: [number, number]) => {
    const params = new URLSearchParams(searchParams?.toString());

    params.set('min_price', String(value[0]));
    params.set('max_price', String(value[1]));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Handle price range change with debouncing
  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    // Update local state immediately for responsive UI
    setRangeValue(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for URL update
    debounceTimeoutRef.current = setTimeout(() => {
      updateUrlParams(value);
    }, DEBOUNCE_DELAY);
  }, [updateUrlParams]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  // Get selected values for attribute filters from URL params
  const getSelectedValues = useCallback((paramName: string): string[] => {
    const param = searchParams?.get(paramName);

    if (!param) {
      return [];
    }

    return param.split(',').filter(Boolean);
  }, [searchParams]);

  // Handle attribute filter change
  const handleAttributeChange = useCallback((paramName: string, selectedValues: string[]) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (selectedValues.length === 0) {
      params.delete(paramName);
    } else {
      params.set(paramName, selectedValues.join(','));
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const filtersContent = (
    <FiltersSection>
      {/* Price Range Filter */}
      {shouldShowPriceFilter && (
        <Filter label="Цена" collapsible>
          <Range
            min={filters.priceRange.min}
            max={filters.priceRange.max}
            value={rangeValue}
            onChange={handlePriceRangeChange}
            unit="₽"
          />
        </Filter>
      )}

      {/* Availability Toggle */}
      {shouldShowStockFilter && (
        <Filter label="В наличии" collapsible={false} oneline>
          <Toggle
            isEnabled={searchParams?.get('in_stock') === '1'}
            onToggle={() => {
              // Toggle component handles URL params internally via paramName
            }}
            paramName="in_stock"
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

        // Показываем фильтр, если:
        // 1. Есть доступные опции для выбора
        // 2. Или есть уже выбранные значения (чтобы можно было их отключить)
        const hasAvailableOptions = section.options && section.options.length > 0;
        const hasSelectedValues = selectedValues.length > 0;

        if (!hasAvailableOptions && !hasSelectedValues) {
          return null;
        }

        return (
          <Filter
            key={section.id}
            label={section.title}
            collapsible
          >
            <Multiselect
              options={section.options}
              selectedValues={selectedValues}
              onSelectionChange={(values) => handleAttributeChange(paramName, values)}
              type={section.type === 'color' ? 'color' : 'checkbox'}
              paramName={paramName}
            />
          </Filter>
        );
      })}
    </FiltersSection>
  );

  return (
    <>
      {filtersContent}
      <FilterPopup isOpen={isFilterOpen} onClose={handleCloseFilter}>
        {filtersContent}
      </FilterPopup>
    </>
  );
};
