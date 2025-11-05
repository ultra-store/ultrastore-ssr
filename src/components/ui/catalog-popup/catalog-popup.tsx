import { useEffect, useRef, useState } from 'react';

import type { WithClassName } from '@/shared/types/utils';

import styles from './catalog-popup.module.css';

interface CatalogPopupProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const CatalogPopup = ({ isOpen, onClose, children, className }: WithClassName<CatalogPopupProps>) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState<number>(0);

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

    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const updateOffset = () => {
      const header = document.getElementById('site-header');

      if (!header) {
        setOffsetTop(0);

        return;
      }
      const rect = header.getBoundingClientRect();

      setOffsetTop(Math.max(0, Math.round(rect.top) + 150));
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    window.addEventListener('scroll', updateOffset, { passive: true });

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('scroll', updateOffset);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        'top': `${offsetTop}px`,
        '--catalog-offset': `${offsetTop}px`,
      } as React.CSSProperties}
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.container}>
          {children}
        </div>
      </div>
    </div>
  );
};
