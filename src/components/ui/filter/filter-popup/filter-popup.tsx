import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button/button';
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
    if (!isOpen) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (document.body) {
        document.body.style.overflow = previousOverflow;
      }
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
          <Button fullWidth onClick={onApply || onClose}>
            Применить фильтры
          </Button>
        </div>
      </div>
    </div>
  );
};
