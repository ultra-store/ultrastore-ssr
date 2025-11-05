'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CatalogMenu } from '@/components/catalog-menu/catalog-menu';
import { MobileMenu } from '@/components/mobile-menu/mobile-menu';
import { BurgerButton } from '@/components/ui/burger-button';
import { CatalogButton } from '@/components/ui/catalog-button';
import { CatalogPopup, useCatalogPopup } from '@/components/ui/catalog-popup';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';
import { IconButton } from '@/components/ui/icon-button';
import { Logo } from '@/components/ui/logo';
import { SearchBar } from '@/components/ui/search-bar';
import { useCart } from '@/shared/context/cart-context';
import icons from '@/shared/icons';

import type { Contacts, MenuItem, Social } from '@/shared/types';

import styles from './header-main-bar.module.css';

export const HeaderMainBar = ({ topMenu, contacts, socials }: {
  topMenu?: MenuItem[]
  contacts?: Contacts
  socials?: Social[]
}) => {
  const router = useRouter();
  const { isOpen: isFilterOpen, setIsOpen: setFilterOpen } = useFilterPopup();
  const { getTotalItems, isHydrated } = useCart();
  const { isOpen: isCatalogOpen, setIsOpen: setCatalogOpen } = useCatalogPopup();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query && query.trim()) {
      const searchQuery = encodeURIComponent(query.trim());

      router.push(`/search?q=${searchQuery}`);
    }
  };

  // Route-change auto-close is handled by menu link clicks and overlay

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
                isOpen={isMobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
                className={styles.burgerButton}
              />
            </>
          )}
      <CatalogButton
        className={styles.catalogButton}
        onClick={() => setCatalogOpen(true)}
      />
      <SearchBar className={styles.searchBar} onSearch={handleSearch} />
      <div className={styles.headerActions}>
        <Link href="/cart">
          <IconButton
            icon={icons.cart}
            aria-label="Корзина"
            badge={isHydrated && getTotalItems() > 0 ? getTotalItems() : undefined}
            as="span"
            layout="column"
          >
            Корзина
          </IconButton>
        </Link>
      </div>
      <CatalogPopup isOpen={isCatalogOpen} onClose={() => setCatalogOpen(false)}>
        <CatalogMenu />
      </CatalogPopup>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menu={topMenu}
        contacts={contacts}
        socials={socials}
      />
    </section>
  );
};
