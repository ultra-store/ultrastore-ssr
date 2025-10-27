import { useEffect, useRef } from 'react';

import type { WithClassName } from '@/shared/types/utils';

import styles from './filter-popup.module.css';

interface FilterPopupProps {
  isOpen: boolean
  onClose: () => void
  onApply?: () => void
  children: React.ReactNode
}

export const FilterPopup = ({ isOpen, onClose, onApply, children, className }: WithClassName<FilterPopupProps>) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={onClose}>
      <div className={`${styles.content} ${className}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          {children}
        </div>
        <div className={styles.footer}>
          <button className={styles.applyButton} onClick={onApply || onClose}>
            Применить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};
