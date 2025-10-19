import { CategoriesNav, HeaderMainBar, HeaderTopBar } from '@/components/header';

import type { Contacts, MenuItem, Social } from '@/shared/types';

import { MobileStickyController } from './mobile-sticky-controller';

import styles from './header.module.css';

export interface HeaderProps {
  topMenu?: MenuItem[]
  categoriesMenu?: MenuItem[]
  contacts?: Contacts
  socials?: Social[]
}

export const Header = ({ topMenu, categoriesMenu, contacts, socials }: HeaderProps) => {
  return (
    <header id="site-header" className={styles.header}>
      <MobileStickyController targetId="site-header" />
      <section className={styles.container}>
        <HeaderTopBar menu={topMenu} contacts={contacts} socials={socials} />
        <HeaderMainBar />
      </section>
      <CategoriesNav items={categoriesMenu} />
    </header>
  );
};
