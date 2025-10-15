import { CategoriesNav } from '@/components/categories-nav';
import { HeaderMainBar } from '@/components/header-main-bar';
import { HeaderTopBar } from '@/components/header-top-bar';

import type { Contacts, MenuItem, Social } from '@/shared/types';

import styles from './header.module.css';

export interface HeaderProps {
  topMenu?: MenuItem[]
  categoriesMenu?: MenuItem[]
  contacts?: Contacts
  social?: Social
}

export const Header = ({ topMenu, categoriesMenu, contacts }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <section className={styles.container}>
        <HeaderTopBar menu={topMenu} contacts={contacts} />
        <HeaderMainBar />
      </section>
      <CategoriesNav items={categoriesMenu} />
    </header>
  );
};
