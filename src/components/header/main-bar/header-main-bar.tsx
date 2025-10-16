import { CatalogButton } from '@/components/ui/catalog-button';
import { IconButton } from '@/components/ui/icon-button';
import { Logo } from '@/components/ui/logo';
import { SearchBar } from '@/components/ui/search-bar';
import icons from '@/shared/icons';

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
