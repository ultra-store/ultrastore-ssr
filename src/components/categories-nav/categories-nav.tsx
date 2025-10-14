import { CategoryLink } from '@/components/ui/category-link';

import styles from './categories-nav.module.css';

/**
 * CategoriesNav - Product category navigation
 * Displays main product categories for quick access
 */
export const CategoriesNav = () => {
  return (
    <nav className={styles.categoriesNav} aria-label="Категории товаров">
      <CategoryLink href="/catalog/apple" text="Apple" />
      <CategoryLink href="/catalog/airpods" text="Airpods" />
      <CategoryLink href="/catalog/garmin" text="Garmin" />
      <CategoryLink href="/catalog/accessories" text="Аксессуары" />
    </nav>
  );
};
