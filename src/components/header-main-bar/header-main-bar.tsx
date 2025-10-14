import { Logo } from '@/components/logo';

import icons from '@/shared/icons';

import { CatalogButton } from '../ui/catalog-button';
import { IconButton } from '../ui/icon-button';
import { SearchBar } from '../ui/search-bar';

import styles from './header-main-bar.module.css';

export const HeaderMainBar = () => {
  return (
    <section className={styles.headerMainBar}>
      <Logo href="/" full className={styles.logo} />
      <div className={styles.catalogAndSearch}>
        <CatalogButton />
        <SearchBar />
      </div>
      <div className={styles.headerActions}>
        <IconButton icon={icons.cart} aria-label="Корзина">
          Корзина
        </IconButton>
      </div>
    </section>
  );
};
