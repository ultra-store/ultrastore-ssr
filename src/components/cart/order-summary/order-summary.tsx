'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/shared/utils/format-price';

import { CartTotal } from '../cart-total/cart-total';

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
      <CartTotal total={total} currency={currency} label="Всего" className={styles.totalDesktop} />
      <Button
        variant="primary"
        fullWidth
        className={styles.checkoutButton}
        onClick={onCheckoutClick}
        value={<span className={styles.totalMobile}>{formattedTotal}</span>}
      >
        К оформлению
      </Button>
    </div>
  );
};
