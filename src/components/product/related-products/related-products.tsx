import { ProductLevel } from '@/components/products/product-level/product-level';

import type { Product } from '@/shared/types/types';

import type { WithClassName } from '@/shared/types/utils';

import styles from './related-products.module.css';

export interface RelatedProductsProps {
  products: Product[]
  title?: string
}

export const RelatedProducts = ({
  products,
  title = 'С этим товаром часто берут',
  className,
}: WithClassName<RelatedProductsProps>) => {
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
