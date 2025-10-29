'use client';

import { ProductGrid } from '@/components/products/product-grid/product-grid';
import { ContactCard } from '@/components/ui/contact-card';
import { FilterButton } from '@/components/ui/filter/filter-button';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';
import { SortSelect, type SortOption } from '@/components/ui/sort-select';

import type { CategoryData, Contacts, Social } from '@/shared/types';

import { CategoryFilters } from './category-filters';

import styles from './category-content.module.css';

interface CategoryContentProps {
  categoryData: CategoryData
  contacts?: Contacts
  social?: Social[]
}

export const CategoryContent = ({ categoryData, contacts, social }: CategoryContentProps) => {
  const {
    products = [],
    sorting,
    filters,
  } = categoryData;

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
                {products.length}
                {' '}
                {products.length === 1 ? 'товар' : products.length > 1 && products.length < 5 ? 'товара' : 'товаров'}
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
          <ProductGrid products={products} />
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
