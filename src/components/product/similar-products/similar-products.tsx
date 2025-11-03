import { ProductLevel } from '@/components/products/product-level/product-level';

import type { Product } from '@/shared/types/types';

import type { WithClassName } from '@/shared/types/utils';

import styles from './similar-products.module.css';

export interface SimilarProductsProps {
  products: Product[]
  title?: string
}

export const SimilarProducts = ({
  products,
  title = 'Похожие товары',
  className,
}: WithClassName<SimilarProductsProps>) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <ProductLevel
        title={title}
        items={products}
        showPricePrefix
        ctaText=""
      />
    </div>
  );
};
