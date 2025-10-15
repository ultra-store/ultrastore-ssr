import { CategoryLink } from '@/components/ui/category-link';

import type { MenuItem } from '@/shared/types';

import styles from './categories-nav.module.css';

export interface CategoriesNavProps { items?: MenuItem[] }

export const CategoriesNav = ({ items }: CategoriesNavProps) => {
  return (
    <nav className={styles.categoriesNav} aria-label="Категории товаров">
      {items?.map((c) => (
        <CategoryLink key={c.id} href={c.url} text={c.title} />
      ))}
    </nav>
  );
};
