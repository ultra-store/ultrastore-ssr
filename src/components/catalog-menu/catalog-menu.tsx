'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCatalogPopup } from '@/components/ui/catalog-popup';
import { getCatalogMenu, type CatalogCategory } from '@/shared/api/getCatalogMenu';

import styles from './catalog-menu.module.css';

export const CatalogMenu = () => {
  const [categories, setCategories] = useState<CatalogCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const { setIsOpen } = useCatalogPopup();

  useEffect(() => {
    getCatalogMenu()
      .then((d) => setCategories(d.categories || []))
      .catch(() => setError('Не удалось загрузить каталог'));
  }, []);

  // Close menu after route actually changes (prevents blink) only if navigation was initiated
  useEffect(() => {
    if (!isNavigating) {
      return;
    }
    const raf = requestAnimationFrame(() => {
      setIsOpen(false);
      setIsNavigating(false);
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, isNavigating, setIsOpen]);

  const catList = useMemo(() => categories || [], [categories]);

  const active = useMemo(() => (catList[activeIndex] || null), [catList, activeIndex]);

  const rightColumns = useMemo(() => {
    if (!active || !active.children) {
      return [] as CatalogCategory[][];
    }

    const level2 = active.children;
    const perCol = Math.ceil(level2.length / 4);
    const cols: CatalogCategory[][] = [];

    for (let i = 0; i < 4; i++) {
      cols.push(level2.slice(i * perCol, (i + 1) * perCol));
    }

    return cols;
  }, [active]);

  const toggleGroup = (id: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={styles.menuGrid}>
      {error && <div className={styles.error}>{error}</div>}
      {!categories && !error && <div className={styles.loading}>Загрузка…</div>}
      {categories && (
        <>
          <aside className={styles.left}>
            <ul className={styles.leftList}>
              {catList.map((c, i) => (
                <li
                  key={c.id}
                  className={`${styles.leftItem} ${i === activeIndex ? styles.leftItemActive : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <Link
                    href={`/${c.slug}`}
                    className={styles.leftLink}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsNavigating(true);
                    }}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <section className={styles.right}>
            {rightColumns.map((group, idx) => (
              <div key={idx} className={styles.column}>
                {group.map((lvl2) => {
                  const lvl3 = (lvl2.children || []).slice().sort((a, b) => b.id - a.id);
                  const isExpanded = !!expandedGroups[lvl2.id];
                  const visible = isExpanded ? lvl3 : lvl3.slice(0, 4);

                  return (
                    <div key={lvl2.id}>
                      <Link
                        href={`/${lvl2.slug}`}
                        className={styles.groupTitle}
                        onClick={() => setIsNavigating(true)}
                      >
                        {lvl2.name}
                      </Link>
                      {visible.length > 0 && (
                        <ul className={styles.children}>
                          {visible.map((c3) => (
                            <li key={c3.id}>
                              <Link
                                href={`/${c3.slug}`}
                                onClick={() => setIsNavigating(true)}
                              >
                                {c3.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      {lvl3.length > 4 && (
                        <div className={styles.showMore} onClick={() => toggleGroup(lvl2.id)}>
                          {isExpanded ? 'Скрыть' : 'Показать все'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};
