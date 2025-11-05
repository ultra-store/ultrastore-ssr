'use client';

import { useEffect, useMemo, useState } from 'react';

import { getCatalogMenu, type CatalogCategory } from '@/shared/api/getCatalogMenu';

import styles from './catalog-menu.module.css';

export const CatalogMenu = () => {
  const [categories, setCategories] = useState<CatalogCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getCatalogMenu()
      .then((d) => setCategories(d.categories || []))
      .catch(() => setError('Не удалось загрузить каталог'));
  }, []);

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
                  onClick={() => setActiveIndex(i)}
                >
                  {c.name}
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
                      <a className={styles.groupTitle} href={`/${lvl2.slug}`}>{lvl2.name}</a>
                      {visible.length > 0 && (
                        <ul className={styles.children}>
                          {visible.map((c3) => (
                            <li key={c3.id}>
                              <a href={`/${c3.slug}`}>{c3.name}</a>
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
