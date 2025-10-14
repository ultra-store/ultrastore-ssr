import Link from 'next/link';

import { Logo } from '@/components/logo';
import { SocialButtons } from '@/components/social-buttons';

import styles from './footer.module.css';

export const Footer = () => {
  const catalogLinks = [
    {
      href: '/catalog/smartphones',
      text: 'Смартфоны',
    },
    {
      href: '/catalog/tablets',
      text: 'Планшеты',
    },
    {
      href: '/catalog/laptops',
      text: 'Ноутбуки и моноблоки',
    },
    {
      href: '/catalog/consoles',
      text: 'Игровые приставки',
    },
    {
      href: '/catalog/audio',
      text: 'Наушники и аудио',
    },
    {
      href: '/catalog/watches',
      text: 'Умные часы и браслеты',
    },
    {
      href: '/catalog/beauty-health',
      text: 'Красота и здоровье',
    },
    {
      href: '/catalog/home-gadgets',
      text: 'Гаджеты для дома',
    },
  ];

  const buyerLinks = [
    {
      href: '/account',
      text: 'Личный кабинет',
    },
    {
      href: '/about',
      text: 'О нас',
    },
    {
      href: '/warranty',
      text: 'Гарантия',
    },
    {
      href: '/trade-in',
      text: 'Трейд-ин',
    },
    {
      href: '/installment',
      text: 'Рассрочка',
    },
    {
      href: '/loyalty',
      text: 'Программа лояльности',
    },
  ];

  return (
    <footer className={styles.footer}>
      <section className={`container ${styles.content}`}>
        <section className={styles.brandBlock}>
          <Logo href="/" title="Ultrastore" full height={40} className={styles.logo} />

          <div className={styles.contacts}>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Link href="https://yandex.ru/maps/-/CLRcJ67q" target="_blank" rel="noopener noreferrer">
                  Санкт-Петербург, Лиговский 71, м. Площадь Восстания
                </Link>
              </li>
              <li className={styles.contactItem}>
                <Link href="tel:+79999999999">+7 (999) 999-99-99</Link>
              </li>
              <li className={styles.contactItem}>
                <Link href="mailto:info@ultrastore.ru">info@ultrastore.ru</Link>
              </li>
              <li className={styles.contactItem}>Ежедневно с 10:00 до 22:00</li>
            </ul>
            <SocialButtons size="s" />
          </div>
        </section>

        <nav className={styles.navColumn} aria-label="Каталог">
          <h3>Каталог</h3>
          <ul className={styles.linkList} role="list">
            {catalogLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.linkItem}>{link.text}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.navColumn} aria-label="Покупателям">
          <h3>Покупателям</h3>
          <ul className={styles.linkList} role="list">
            {buyerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.linkItem}>{link.text}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </footer>
  );
};
