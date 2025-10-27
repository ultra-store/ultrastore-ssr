'use client';

import Image from 'next/image';

import { BurgerButton } from '@/components/ui/burger-button';
import { CatalogButton } from '@/components/ui/catalog-button';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';
import { IconButton } from '@/components/ui/icon-button';
import { Logo } from '@/components/ui/logo';
import { SearchBar } from '@/components/ui/search-bar';
import icons from '@/shared/icons';

import styles from './header-main-bar.module.css';

export const HeaderMainBar = () => {
  const { isOpen: isFilterOpen, setIsOpen: setFilterOpen } = useFilterPopup();

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  return (
    <section className={styles.headerMainBar}>
      <Logo href="/" full className={styles.logo} priority />
      {isFilterOpen
        ? (
            <>
              <button
                className={styles.closeButton}
                onClick={handleCloseFilter}
                aria-label="Закрыть фильтры"
              >
                <Image src={icons.close} alt="Закрыть" width={25} height={25} />
              </button>
            </>
          )
        : (
            <>
              <BurgerButton
                isOpen={false}
                onClick={() => {
                  /* empty */
                }}
                className={styles.burgerButton}
              />
            </>
          )}
      <CatalogButton className={styles.catalogButton} />
      <SearchBar className={styles.searchBar} />
      <div className={styles.headerActions}>
        <IconButton icon={icons.cart} aria-label="Корзина" />
      </div>
    </section>
  );
};
