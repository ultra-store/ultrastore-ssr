import { ProductCard } from '@/components/products';
import { LongButton } from '@/components/ui/long-button';

import { Section } from '@/components/ui/section';
import type { Product } from '@/shared/types/types';

import styles from './product-level.module.css';

export interface ProductLevelProps {
  title?: string
  items?: Product[]
  ctaText?: string
  ctaHref?: string
  showPricePrefix?: boolean
}

export const ProductLevel = ({
  title = 'Новинки',
  items = [],
  ctaText = 'Смотреть все',
  ctaHref = '#',
  showPricePrefix = false,
}: ProductLevelProps) => {
  if (!items.length) {
    return null;
  }

  return (
    <Section title={title} ariaLabel={title} className={styles.section}>
      <div className={styles.row}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            className={styles.productCard}
            showPricePrefix={showPricePrefix}
            has_variations={product.has_variations}
          />
        ))}
      </div>

      {ctaText && (
        <LongButton href={ctaHref} asButton={!ctaHref}>{`${ctaText} →`}</LongButton>
      )}
    </Section>
  );
};
