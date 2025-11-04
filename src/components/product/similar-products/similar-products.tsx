import { ProductLevel } from '@/components/products/product-level/product-level';

import type { Product } from '@/shared/types/types';

import type { WithClassName } from '@/shared/types/utils';

export interface SimilarProductsProps {
  products: Product[]
  title?: string
}

export const SimilarProducts = ({
  products,
  title = 'Похожие товары',
}: WithClassName<SimilarProductsProps>) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <ProductLevel
      title={title}
      items={products}
      showPricePrefix
      ctaText=""
    />
  );
};
