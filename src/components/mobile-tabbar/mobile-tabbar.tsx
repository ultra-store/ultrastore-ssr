'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import icons from '@/shared/icons';

import { TabButton } from './tab-button';

import styles from './mobile-tabbar.module.css';

interface TabItem {
  href: string
  icon: keyof typeof icons
  label: string
  badge?: number
}

const tabs: TabItem[] = [
  {
    href: '/',
    icon: 'home',
    label: 'Главная',
  },
  {
    href: '/catalog',
    icon: 'catalog',
    label: 'Каталог',
  },
  {
    href: '/cart',
    icon: 'cart',
    label: 'Корзина',
  },
];

export const MobileTabBar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileTabBar}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link key={tab.href} href={tab.href} className={styles.tabLink}>
            <TabButton
              icon={icons[tab.icon]}
              alt={tab.label}
              badge={tab.badge}
              isActive={isActive}
            >
              {tab.label}
            </TabButton>
          </Link>
        );
      })}
    </nav>
  );
};
