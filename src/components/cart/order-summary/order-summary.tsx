'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/shared/utils/format-price';

import styles from './order-summary.module.css';

interface OrderSummaryProps {
  total: string
  currency?: string
  onCheckoutClick?: () => void
  className?: string
}

export const OrderSummary = ({
  total,
  currency = '₽',
  onCheckoutClick,
  className = '',
}: OrderSummaryProps) => {
  const formattedTotal = formatPrice(total, currency);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.totalRow}>
        <span className={styles.label}>Общая стоимость</span>
        <span className={`large-bold ${styles.total}`}>{formattedTotal}</span>
      </div>
      <Button
        variant="primary"
        fullWidth
        className={styles.checkoutButton}
        onClick={onCheckoutClick}
      >
        К оформлению
      </Button>
    </div>
  );
};
