import type { WithClassName } from '@/shared/types/utils';
import { formatPrice } from '@/shared/utils/format-price';

import styles from './cart-total.module.css';

export interface CartTotalProps {
  total: string
  currency?: string
  label?: string
}

export const CartTotal = ({ total, currency = '₽', label = 'Всего', className }: WithClassName<CartTotalProps>) => {
  return (
    <div className={`${styles.totalSection} ${className || ''}`}>
      <div className={styles.totalRow}>
        <span className={`large-bold text-primary ${styles.totalLabel}`}>{label}</span>
        <span className={`number text-primary ${styles.totalAmount}`}>
          {formatPrice(total, currency)}
        </span>
      </div>
    </div>
  );
};
