import { ProductCard } from '@/components/products';
import { FilterButton } from '@/components/ui/filter/filter-button';
import { SortSelect, type SortOption } from '@/components/ui/sort-select';
import type { Product } from '@/shared/types/types';

import styles from './product-grid.module.css';

interface ProductGridProps {
  products: Product[]
  sortingOptions?: SortOption[]
  defaultSort?: string
  onFilterButtonClick?: () => void
}

export const ProductGrid = ({ products, sortingOptions, defaultSort = 'price', onFilterButtonClick }: ProductGridProps) => {
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

  const sortOptions = sortingOptions || defaultSortOptions;

  return (
    <div className={styles.productGridContainer}>
      {sortOptions.length > 0 && onFilterButtonClick && (
        <div className={styles.controls}>
          <SortSelect options={sortOptions} defaultValue={defaultSort} />
          <FilterButton
            className={styles.filterButton}
            onClick={onFilterButtonClick}
          />
        </div>
      )}
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard {...product} />
          </li>
        ))}
      </ul>
    </div>
  );
};
