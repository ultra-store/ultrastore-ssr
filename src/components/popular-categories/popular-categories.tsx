import Image from 'next/image';
import Link from 'next/link';

import type { Category } from '@/shared/types';

import styles from './popular-categories.module.css';

export interface PopularCategoriesProps {
  title?: string
  items?: Category[]
}

export const PopularCategories = ({ title = 'Популярные категории', items }: PopularCategoriesProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <section className={styles.wrapper} aria-label={title}>
      <h2 className={`heading-1 ${styles.title}`}>{title}</h2>
      <div className={styles.grid}>
        {items.map((c) => (
          <Link key={c.id} href={c.link || `/catalog/${c.slug}`} className={styles.link}>
            <div className={styles.card}>
              <div className={styles.image}>
                <Image
                  src={c.image || '/placeholder-product.png'}
                  alt={c.name}
                  width={180}
                  height={100}
                />
              </div>
              <div className="large">
                {c.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
