import Link from 'next/link';

import { Logo } from '@/components/logo';
import { SocialButtons } from '@/components/social-buttons';

import type { Contacts, MenuItem, Social } from '@/shared/types';

import styles from './footer.module.css';

export interface FooterProps {
  menu?: MenuItem[]
  contacts?: Contacts
  social?: Social
}
export const Footer = ({ menu, contacts }: FooterProps) => {
  const parents = menu?.filter(({ parent_id }) => !parent_id || Number(parent_id) === 0)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getChildren = (parentId: number) =>
    menu
      ?.filter(({ parent_id }) => Number(parent_id) === parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

  const mapHref = contacts?.map_iframe || 'https://yandex.ru/maps/-/CLRcJ67q';
  const phoneText = contacts?.phone_primary || '+7 (999) 999-99-99';
  const phoneHref = `tel:${phoneText.replace(/[^+\d]/g, '')}`;
  const emailText = contacts?.email || 'info@ultrastore.ru';
  const emailHref = `mailto:${emailText}`;
  const address = contacts?.address || 'Санкт-Петербург, Лиговский 71, м. Площадь Восстания';
  const workingHours = contacts?.working_hours || 'Ежедневно с 10:00 до 22:00';

  return (
    <footer className={styles.footer}>
      <section className={`container ${styles.content}`}>
        <section className={styles.brandBlock}>
          <Logo href="/" title="Ultrastore" full height={40} className={styles.logo} />

          <div className={styles.contacts}>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Link href={mapHref} target="_blank" rel="noopener noreferrer">
                  {address}
                </Link>
              </li>
              <li className={styles.contactItem}>
                <Link href={phoneHref}>{phoneText}</Link>
              </li>
              <li className={styles.contactItem}>
                <Link href={emailHref}>{emailText}</Link>
              </li>
              <li className={styles.contactItem}>{workingHours}</li>
            </ul>
            <SocialButtons
              size="s"
            />
          </div>
        </section>

        {parents?.map((parent) => {
          const children = getChildren(parent.id);

          return (
            <nav key={parent.id} className={styles.navColumn} aria-label={parent.title}>
              <ul className={styles.linkList} role="list">
                <li>
                  <Link href={parent.url} className={`${styles.linkItem} ${styles.parentItem}`}>{parent.title}</Link>
                </li>
                {children?.map((child) => (
                  <li key={child.id}>
                    <Link href={child.url} className={styles.linkItem}>{child.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </section>
    </footer>
  );
};
