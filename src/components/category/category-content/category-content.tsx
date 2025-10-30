'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ProductGrid } from '@/components/products/product-grid/product-grid';
import { ContactCard } from '@/components/ui/contact-card';
import { FilterButton } from '@/components/ui/filter/filter-button';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';
import { SortSelect, type SortOption } from '@/components/ui/sort-select';

import { getCategoryData } from '@/shared/api/getCategoryData';
import type { CategoryData, Contacts, Social, CategorySearchParams, Product } from '@/shared/types';

import { CategoryFilters } from './category-filters';

import styles from './category-content.module.css';

interface CategoryContentProps {
  categoryData: CategoryData
  categorySlug: string
  initialSearch: CategorySearchParams
  contacts?: Contacts
  social?: Social[]
}

export const CategoryContent = ({
  categoryData,
  categorySlug,
  initialSearch,
  contacts,
  social,
}: CategoryContentProps) => {
  const { sorting, filters } = categoryData;

  const [items, setItems] = useState<Product[]>(categoryData.products || []);
  const [hasMore, setHasMore] = useState<boolean>(categoryData.has_more);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pageRef = useRef<number>(categoryData.page || 1);

  const stableSearch = useMemo(() => ({ ...initialSearch }), [initialSearch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();

    abortRef.current = controller;
    setIsLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;

      const data = await getCategoryData(
        categorySlug,
        {
          ...stableSearch,
          page: nextPage,
        },
        { signal: controller.signal },
      );

      setItems((prev) => [...prev, ...(data.products || [])]);
      pageRef.current = data.page || nextPage;
      setHasMore(Boolean(data.has_more));
    } catch {
      // swallow errors during incremental loading to avoid UX break
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingMore(false);
      }
    }
  }, [categorySlug, stableSearch, hasMore, isLoadingMore]);

  useEffect(() => {
    // Reset when inputs change (category or search via navigation)
    setItems(categoryData.products || []);
    pageRef.current = categoryData.page || 1;
    setHasMore(categoryData.has_more);
  }, [categoryData]);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const el = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        loadMore();
      }
    }, { rootMargin: '200px 0px' });

    observer.observe(el);

    return () => observer.unobserve(el);
  }, [loadMore]);

  const { setIsOpen: setFilterOpen } = useFilterPopup();

  const phoneText = contacts?.phone_primary || '+7 (999) 999-99-99';
  const emailText = contacts?.email || 'info@ultrastore.ru';

  const defaultSortOptions: SortOption[] = [
    {
      value: 'price',
      label: 'Сначала подешевле',
    },
    {
      value: 'price-desc',
      label: 'Сначала подороже',
    },
    {
      value: 'date',
      label: 'Сначала новые',
    },
    {
      value: 'rating',
      label: 'По рейтингу',
    },
  ];

  const sortOptions = sorting?.options || defaultSortOptions;

  const handleFilterButtonClick = () => {
    setFilterOpen(true);
  };

  return (
    <section className={styles.content}>
      <aside className={styles.filters} aria-label="Фильтры">
        <CategoryFilters filters={filters} />
      </aside>
      <section className={styles.productsSection} aria-label="Товары">
        <div className={styles.productsSectionContent}>
          {sortOptions.length > 0 && (
            <div className={styles.controls}>
              <span className={`large text-placeholder ${styles.controlsCount}`}>
                {categoryData.total}
                {' '}
                {categoryData.total === 1 ? 'товар' : categoryData.total > 1 && categoryData.total < 5 ? 'товара' : 'товаров'}
              </span>
              <div className={styles.controlsSort}>
                <SortSelect
                  options={sortOptions}
                  defaultValue={sorting?.default || 'price'}
                />
              </div>
              <FilterButton
                className={styles.filterButton}
                onClick={handleFilterButtonClick}
              />
            </div>
          )}
          <ProductGrid products={items} />
          <div ref={sentinelRef} aria-hidden />
          {isLoadingMore && (
            <div className={styles.controls} aria-live="polite">Загрузка…</div>
          )}
        </div>
        <ContactCard
          title="Не нашли нужный товар?"
          subtitle="Свяжитесь с нами, возможно, мы сможем помочь"
          phone={{
            label: 'Телефон',
            value: phoneText,
            href: `tel:${phoneText.replace(/[^+\d]/g, '')}`,
          }}
          email={{
            label: 'Почта',
            value: emailText,
            href: `mailto:${emailText}`,
          }}
          social={social}
        />
      </section>
    </section>
  );
};
