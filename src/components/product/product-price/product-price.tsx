'use client';

import type { WithClassName } from '@/shared/types/utils';

import styles from './product-price.module.css';

export interface ProductPriceProps {
  price: string
  onSale?: boolean
  variant?: 'mobile' | 'desktop' | 'default'
}

export const ProductPrice = ({ price, onSale, variant = 'default', className }: WithClassName<ProductPriceProps>) => {
  const visibilityClass = variant === 'mobile'
    ? styles.mobileOnly
    : variant === 'desktop'
      ? styles.desktopOnly
      : '';

  return (
    <div className={`${styles.priceSection} ${visibilityClass} ${className || ''}`}>
      <span className={`heading-1 ${styles.price} ${onSale ? styles.salePrice : ''}`}>
        {price}
      </span>
    </div>
  );
};
