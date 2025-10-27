import { ProductGrid } from '@/components/products/product-grid/product-grid';
import { Section } from '@/components/ui/section';

import type { Product } from '@/shared/types/types';

import type { WithClassName } from '@/shared/types/utils';

import styles from './related-products.module.css';

export interface RelatedProductsProps {
  products: Product[]
  title?: string
}

export const RelatedProducts = ({
  products,
  title = 'Похожие товары',
  className,
}: WithClassName<RelatedProductsProps>) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Section title={title} ariaLabel={title}>
        <ProductGrid products={products} />
      </Section>
    </div>
  );
};
