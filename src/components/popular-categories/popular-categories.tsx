import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/ui/section';
import type { Category } from '@/shared/types';

import styles from './popular-categories.module.css';

export interface PopularCategoriesProps { items?: Category[] }

export const PopularCategories = ({ items }: PopularCategoriesProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <Section title="Популярные категории" className={styles.section}>
      <div className={styles.grid}>
        {items.map((c) => (
          <Link key={c.id} href={c.slug || `/${c.slug}`} className={styles.link}>
            <div className={styles.card}>
              <div className={styles.image}>
                <Image src={c.image || '/placeholder-product.png'} alt={c.name} width={180} height={100} />
              </div>
              <div className={styles.secondary}>{c.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
};
