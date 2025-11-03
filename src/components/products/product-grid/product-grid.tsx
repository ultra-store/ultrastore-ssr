import { ProductCard } from '@/components/products';
import type { Product } from '@/shared/types/types';

import styles from './product-grid.module.css';

interface ProductGridProps { products: Product[] }

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard {...product} has_variations={product.has_variations} />
        </li>
      ))}
    </ul>
  );
};
