'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter, FilterPopup, FiltersSection, Range, Toggle } from '@/components/ui/filter';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';

import type { FilterData } from '@/shared/types';

interface CategoryFiltersProps { filters: FilterData }

const DEBOUNCE_DELAY = 500; // 500ms delay before updating URL

export const CategoryFilters = ({ filters }: CategoryFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen: isFilterOpen, setIsOpen: setFilterOpen } = useFilterPopup();

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

  const filtersContent = (
    <FiltersSection>
      {/* Price Range Filter */}
      <Filter label="Цена" collapsible>
        <Range
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          value={rangeValue}
          onChange={handlePriceRangeChange}
          unit="₽"
        />
      </Filter>

      {/* Availability Toggle */}
      <Filter label="В наличии" collapsible={false} oneline>
        <Toggle
          isEnabled={searchParams?.get('in_stock') === '1'}
          onToggle={() => {
            // Toggle component handles URL params internally via paramName
          }}
          paramName="in_stock"
        />
      </Filter>
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
