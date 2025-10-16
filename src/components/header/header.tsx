import { CategoriesNav, HeaderMainBar, HeaderTopBar } from '@/components/header';

import type { Contacts, MenuItem, Social } from '@/shared/types';

import styles from './header.module.css';

export interface HeaderProps {
  topMenu?: MenuItem[]
  categoriesMenu?: MenuItem[]
  contacts?: Contacts
  socials?: Social[]
}

export const Header = ({ topMenu, categoriesMenu, contacts, socials }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <section className={styles.container}>
        <HeaderTopBar menu={topMenu} contacts={contacts} socials={socials} />
        <HeaderMainBar />
      </section>
      <CategoriesNav items={categoriesMenu} />
    </header>
  );
};
