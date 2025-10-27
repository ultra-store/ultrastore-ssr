'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import icons from '@/shared/icons';

import styles from './filters-section.module.css';

export interface FiltersSectionProps {
  onClear?: () => void
  children?: React.ReactNode
}

export const FiltersSection = ({ onClear, children }: FiltersSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [justCleared, setJustCleared] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }

    // Clear all query params related to filters by resetting to pathname only
    // Keep scroll position to avoid layout jump
    router.replace(pathname || '/', { scroll: false });

    // trigger success animation briefly
    setJustCleared(true);
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setTimeout(() => {
      setJustCleared(false);
      timerRef.current = null;
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <button className={styles.clearButton} onClick={handleClear} aria-label="Сбросить фильтры">
          <span className={styles.clearIconWrap}>
            <Image src={justCleared ? icons.checkmark : icons.close} alt={justCleared ? 'Готово' : 'Очистить'} width={25} height={25} className={justCleared ? styles.checkmarkIcon : ''} />
          </span>
          <span className={`large text-primary ${styles.clearLabel}`} data-success={justCleared}>Сбросить фильтры</span>
        </button>
      </div>

      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
};
