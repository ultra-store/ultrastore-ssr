import { CategoriesNav } from '@/components/categories-nav';
import { HeaderMainBar } from '@/components/header-main-bar';
import { HeaderTopBar } from '@/components/header-top-bar';

import styles from './header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <section className={styles.container}>
        <HeaderTopBar />
        <HeaderMainBar />
      </section>
      <CategoriesNav />
    </header>
  );
};
