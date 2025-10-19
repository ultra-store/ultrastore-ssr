import { ProductCard } from '@/components/products';
import { LongButton } from '@/components/ui/long-button';

import type { Product } from '@/shared/types/types';

import styles from './product-level.module.css';

export interface ProductLevelProps {
  title?: string
  items?: Product[]
  ctaText?: string
  ctaHref?: string
}

export const ProductLevel = ({
  title = 'Новинки',
  items = [],
  ctaText = 'Смотреть все',
  ctaHref = '#',
}: ProductLevelProps) => {
  if (!items.length) {
    return null;
  }

  const visible = items.slice(0, 5);

  return (
    <section className={`section ${styles.section}`} aria-label={title}>
      <h2 className={`heading-1 ${styles.title}`}>{title}</h2>
      <div className={styles.row}>
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>

      <LongButton href={ctaHref} asButton>{`${ctaText} →`}</LongButton>
    </section>
  );
};
