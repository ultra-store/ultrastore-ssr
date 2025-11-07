'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { createPortal } from 'react-dom';

import { SocialButtons } from '@/components/social-buttons';
import { getCatalogMenu, type CatalogCategory } from '@/shared/api/getCatalogMenu';
import icons from '@/shared/icons';
import type { Contacts, MenuItem, Social } from '@/shared/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './mobile-menu.module.css';

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  menu?: MenuItem[]
  contacts?: Contacts
  socials?: Social[]
}

export const MobileMenu = ({ isOpen, onClose, menu, contacts, socials, className }: WithClassName<MobileMenuProps>) => {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<CatalogCategory[] | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [isCatalogOpen, setCatalogOpen] = useState(false);
  const [expandedLevel2, setExpandedLevel2] = useState<Record<number, boolean>>({});
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prev = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    if (!categories) {
      getCatalogMenu().then((d) => setCategories(d.categories || [])).catch(() => setCategories([]));
    }

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose, categories]);

  // Close menu after route actually changes (prevents blink) only if navigation was initiated
  useEffect(() => {
    if (!isOpen || !isNavigating) {
      return;
    }
    const raf = requestAnimationFrame(() => {
      onClose();
      setIsNavigating(false);
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, isOpen, isNavigating, onClose]);

  const navigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push(href);
    // Closing occurs after pathname changes
  };

  const list = useMemo(() => categories || [], [categories]);

  if (!isOpen) {
    return null;
  }

  const content = (
    <div className={`${styles.overlay} ${className || ''}`} role="dialog" aria-modal="true" data-navigating={isNavigating} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <nav className={styles.quickNav} aria-label="Быстрые действия">
          <Link href="/cart" className={styles.quickItem} onClick={(e) => navigate(e, '/cart')}>
            <Image src={icons.cart} alt="Корзина" width={20} height={20} />
            <span>Корзина</span>
          </Link>
        </nav>

        <section className={styles.group}>
          <button
            className={styles.groupHeader}
            aria-expanded={isCatalogOpen}
            onClick={() => setCatalogOpen((v) => !v)}
          >
            <span className={styles.groupTitle}>Каталог</span>
            <Image
              src={isCatalogOpen ? icons.arrowUp : icons.arrowDown}
              alt=""
              width={15}
              height={15}
              aria-hidden
            />
          </button>
          <div className={styles.groupBody} data-open={isCatalogOpen}>
            {list.map((cat) => (
              <div key={cat.id} className={styles.catItem}>
                {cat.children && cat.children.length > 0
                  ? (
                      <button
                        type="button"
                        className={styles.catHeader}
                        aria-expanded={!!expanded[cat.id]}
                        onClick={() => setExpanded((p) => ({
                          ...p,
                          [cat.id]: !p[cat.id],
                        }))}
                      >
                        <span>{cat.name}</span>
                        <Image
                          src={!!expanded[cat.id] ? icons.arrowUp : icons.arrowDown}
                          alt=""
                          width={15}
                          height={15}
                          aria-hidden
                        />
                      </button>
                    )
                  : (
                      <Link
                        href={`/${cat.slug}`}
                        className={styles.catHeader}
                        onClick={(e) => navigate(e, `/${cat.slug}`)}
                      >
                        <span>{cat.name}</span>
                      </Link>
                    )}
                {cat.children && cat.children.length > 0 && (
                  <div className={styles.catChildren} data-open={!!expanded[cat.id]}>
                    {cat.children.map((ch) => (
                      <div key={ch.id} className={styles.childItem}>
                        {ch.children && ch.children.length > 0
                          ? (
                              <button
                                type="button"
                                className={styles.childButton}
                                aria-expanded={!!expandedLevel2[ch.id]}
                                onClick={() => setExpandedLevel2((p) => ({
                                  ...p,
                                  [ch.id]: !p[ch.id],
                                }))}
                              >
                                <span>{ch.name}</span>
                                <Image
                                  src={!!expandedLevel2[ch.id] ? icons.arrowUp : icons.arrowDown}
                                  alt=""
                                  width={15}
                                  height={15}
                                  aria-hidden
                                />
                              </button>
                            )
                          : (
                              <Link
                                href={`/${ch.slug}`}
                                className={styles.childLink}
                                onClick={(e) => navigate(e, `/${ch.slug}`)}
                              >
                                {ch.name}
                              </Link>
                            )}
                        {ch.children && ch.children.length > 0 && expandedLevel2[ch.id] && (
                          <div className={styles.grandChildren}>
                            {ch.children.map((gch) => (
                              <Link
                                key={gch.id}
                                href={`/${gch.slug}`}
                                className={styles.grandChildLink}
                                onClick={(e) => navigate(e, `/${gch.slug}`)}
                              >
                                <span className={styles.grandChildText}>
                                  {gch.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        {menu && menu.length > 0 && (
          <section className={styles.linksSection}>
            {menu.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={styles.rowLink}
                onClick={(e) => navigate(e, item.url)}
              >
                {item.title}
              </Link>
            ))}
          </section>
        )}

        {(contacts || socials) && (
          <section className={styles.contactsSection}>
            {contacts?.phone_primary && (
              <a href={`tel:${contacts.phone_primary}`} className={`${styles.contactRow} ${styles.bold}`}>
                <span className={styles.contactIcon}>
                  <Image src={icons.phone} alt="Телефон" width={18} height={18} />
                </span>
                <span className={styles.contactText}>{contacts.phone_primary}</span>
              </a>
            )}
            {contacts?.address && (
              <div className={styles.contactRow}>
                <span className={styles.contactIcon}>
                  <Image src={icons.pin} alt="Адрес" width={18} height={18} />
                </span>
                <span className={styles.contactText}>{contacts.address}</span>
              </div>
            )}
            {contacts?.working_hours && (
              <div className={styles.contactRow}>
                <span className={styles.contactIcon}>
                  <Image src={icons.clock} alt="Время работы" width={18} height={18} />
                </span>
                <span className={styles.contactText}>{contacts.working_hours}</span>
              </div>
            )}
            {contacts?.email && (
              <a href={`mailto:${contacts.email}`} className={styles.contactRow}>
                <span className={styles.contactIcon}>
                  <Image src={icons.mail} alt="Email" width={18} height={18} />
                </span>
                <span className={styles.contactText}>{contacts.email}</span>
              </a>
            )}
            {socials && socials.length > 0 && (
              <SocialButtons className={styles.socials} size="sm" socials={socials} />
            )}
          </section>
        )}

        <div className={styles.footerSpacer} />
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
