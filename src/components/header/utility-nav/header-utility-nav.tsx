import { NavLink } from '@/components/ui/nav-link';

import type { MenuItem } from '@/shared/types';

import styles from './header-utility-nav.module.css';

export const HeaderUtilityNav = ({ menu }: { menu?: MenuItem[] }) => {
  if (!menu || menu.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop view - horizontal nav */}
      <nav className={styles.topNav} aria-label="Основная навигация">
        {menu.map((item) => (
          <NavLink key={item.id} href={item.url} text={item.title} />
        ))}
      </nav>

      {/* Tablet view - first menu item only */}
      <div className={styles.tabletNav}>
        <NavLink href={menu[0].url} text={menu[0].title} />
      </div>
    </>
  );
};
