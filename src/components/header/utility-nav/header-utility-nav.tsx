import { NavLink } from '@/components/ui/nav-link';

import type { MenuItem } from '@/shared/types';

import styles from './header-utility-nav.module.css';

export const HeaderUtilityNav = ({ menu }: { menu?: MenuItem[] }) => {
  return (
    <nav className={styles.topNav} aria-label="Основная навигация">
      {
        menu?.map((item) => (
          <NavLink key={item.id} href={item.url} text={item.title} />
        ))
      }
    </nav>
  );
};
