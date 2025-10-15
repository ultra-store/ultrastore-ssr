import { LongButton } from '@/components/ui/long-button';

import { ProductCard } from '../product-card/product-card';

import styles from './product-level.module.css';

export interface ProductItem {
  id: number
  name: string
  image?: string
  price: string
  link?: string
}

export interface ProductLevelProps {
  title?: string
  items?: ProductItem[]
  ctaText?: string
  ctaHref?: string
}

export const ProductLevel = ({ title = 'Новинки', items = [], ctaText = 'Смотреть все', ctaHref = '#' }: ProductLevelProps) => {
  if (!items.length) {
    return null;
  }

  const visible = items.slice(0, 5);

  return (
    <section className={`section ${styles.section}`} aria-label={title}>
      <h2 className={`heading-1 ${styles.title}`}>{title}</h2>
      <div className={styles.row}>
        {visible.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} image={p.image} price={p.price} link={p.link} />
        ))}
      </div>

      <LongButton href={ctaHref} asButton>{`${ctaText} →`}</LongButton>
    </section>
  );
};
