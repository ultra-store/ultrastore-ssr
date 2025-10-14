import { NavLink } from '@/components/ui/nav-link';

import styles from './header-utility-nav.module.css';

export const HeaderUtilityNav = () => {
  return (
    <nav className={styles.topNav} aria-label="Основная навигация">
      <NavLink href="/customers" text="Покупателям" />
      <NavLink href="/trade-in" text="Трейд-ин" />
      <NavLink href="/service" text="Сервисный центр" />
      <NavLink href="/blog" text="Блог" />
      <NavLink href="/about" text="О нас" />
      <NavLink href="/contacts" text="Контакты" />
    </nav>
  );
};
