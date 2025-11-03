'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { BurgerButton } from '@/components/ui/burger-button';
import { CatalogButton } from '@/components/ui/catalog-button';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';
import { IconButton } from '@/components/ui/icon-button';
import { Logo } from '@/components/ui/logo';
import { SearchBar } from '@/components/ui/search-bar';
import { useCart } from '@/shared/context/cart-context';
import icons from '@/shared/icons';

import styles from './header-main-bar.module.css';

export const HeaderMainBar = () => {
  const router = useRouter();
  const { isOpen: isFilterOpen, setIsOpen: setFilterOpen } = useFilterPopup();
  const { getTotalItems, isHydrated } = useCart();

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query && query.trim()) {
      const searchQuery = encodeURIComponent(query.trim());

      router.push(`/search?q=${searchQuery}`);
    }
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
      <SearchBar className={styles.searchBar} onSearch={handleSearch} />
      <div className={styles.headerActions}>
        <Link href="/cart">
          <IconButton
            icon={icons.cart}
            aria-label="Корзина"
            badge={isHydrated && getTotalItems() > 0 ? getTotalItems() : undefined}
            as="span"
          />
        </Link>
      </div>
    </section>
  );
};
