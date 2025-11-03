'use client';

import { useEffect } from 'react';

import { useCart } from '@/shared/context/cart-context';
import type { PaymentMethod } from '@/shared/context/checkout-context';
import { useCheckout } from '@/shared/context/checkout-context';
import { formatPrice } from '@/shared/utils/format-price';

import styles from './payment-step.module.css';

const paymentMethods: {
  key: PaymentMethod
  label: string
  description?: string
}[] = [
  {
    key: 'cash',
    label: 'Наличными',
    description: 'При доставке курьером доступен только этот способ оплаты',
  },
  {
    key: 'card',
    label: 'Картой в магазине',
  },
  {
    key: 'sbp',
    label: 'СБП',
  },
  {
    key: 'installment',
    label: 'В рассрочку',
    description: 'Оформляется в магазине при предъявлении паспорта',
  },
];

export const PaymentStep = () => {
  const { checkoutData, updatePaymentData } = useCheckout();
  const { getTotalPrice } = useCart();
  const { method } = checkoutData.payment;
  const deliveryMethod = checkoutData.delivery.method;
  const total = getTotalPrice();

  // If delivery method is courier, only cash payment is allowed
  const isCourierDelivery = deliveryMethod === 'courier';

  // If courier is selected and payment is not cash, reset to cash
  useEffect(() => {
    if (isCourierDelivery && method !== 'cash') {
      updatePaymentData({ method: 'cash' });
    }
  }, [isCourierDelivery, method, updatePaymentData]);

  const handleMethodChange = (newMethod: PaymentMethod) => {
    // Prevent changing payment method if courier delivery is selected
    if (isCourierDelivery && newMethod !== 'cash') {
      return;
    }
    updatePaymentData({ method: newMethod });
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.methodCard} ${method === 'cash' ? styles.selected : ''}`}
        onClick={() => handleMethodChange('cash')}
      >
        <div className={styles.radioButton}>
          <div className={`${styles.radioCircle} ${method === 'cash' ? styles.checked : ''}`} />
        </div>
        <div className={styles.methodContent}>
          <div className={styles.methodHeader}>
            <div className={styles.methodTitle}>Наличными</div>
            <div className={styles.totalPrice}>{formatPrice(total.toString(), '₽')}</div>
          </div>
          <div className={styles.description}>
            При доставке курьером доступен только этот способ оплаты
          </div>
        </div>
      </div>

      {paymentMethods.slice(1).map((paymentMethod) => {
        const isDisabled = isCourierDelivery;

        return (
          <div
            key={paymentMethod.key}
            className={`${styles.methodCard} ${method === paymentMethod.key ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
            onClick={() => !isDisabled && handleMethodChange(paymentMethod.key)}
          >
            <div className={styles.radioButton}>
              <div className={`${styles.radioCircle} ${method === paymentMethod.key ? styles.checked : ''} ${isDisabled ? styles.disabled : ''}`} />
            </div>
            <div className={styles.methodContent}>
              <div className={styles.methodTitle}>{paymentMethod.label}</div>
              {paymentMethod.description && (
                <div className={styles.description}>{paymentMethod.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
