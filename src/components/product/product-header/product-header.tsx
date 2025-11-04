'use client';

import type { WithClassName } from '@/shared/types/utils';

import styles from './product-header.module.css';

export interface ProductHeaderProps {
  name: string
  sku?: string | null
  variant?: 'mobile' | 'desktop' | 'default'
}

export const ProductHeader = ({ name, sku, variant = 'default', className }: WithClassName<ProductHeaderProps>) => {
  const visibilityClass = variant === 'mobile'
    ? styles.mobileOnly
    : variant === 'desktop'
      ? styles.desktopOnly
      : '';

  return (
    <div className={`${styles.header} ${visibilityClass} ${className || ''}`}>
      <h1 className={`heading-1 text-primary ${styles.title}`}>{name}</h1>
      <div className={`medium text-primary ${styles.sku}`}>
        {sku && (
          <>
            <span className={styles.skuLabel}>Артикул</span>
            <span className={styles.skuValue}>{sku}</span>
          </>
        )}
      </div>
    </div>
  );
};
