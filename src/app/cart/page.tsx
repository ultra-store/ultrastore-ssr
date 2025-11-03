'use client';

import { useEffect, useState } from 'react';

import { CartItem, CouponInput, OrderSummary } from '@/components/cart';
import { CheckoutForm } from '@/components/checkout';
import { Section } from '@/components/ui/section';
import { useCart } from '@/shared/context/cart-context';
import { useCheckout } from '@/shared/context/checkout-context';
import { formatPrice } from '@/shared/utils/format-price';

import styles from './page.module.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { currentStep } = useCheckout();
  const [showCheckout, setShowCheckout] = useState(false);

  // Show checkout form if we're on any checkout step (after reload)
  useEffect(() => {
    // Check if there's an active checkout session (not just saved user data)
    const hasActiveCheckoutSession = () => {
      try {
        const savedCheckout = localStorage.getItem('ultrastore_checkout');

        if (savedCheckout) {
          const parsed = JSON.parse(savedCheckout);

          // Check if this is a checkout session (has step saved) or has non-default data
          // We want to distinguish between user starting checkout vs just having saved user data
          if (parsed?.step) {
            // Has step saved, definitely in checkout
            return true;
          }

          // If no step but has checkout data, check if it's different from just user data
          // This happens when user clicked "К оформлению" and started filling but didn't move to next step
          return !!parsed?.data;
        }
      } catch {
        // Ignore errors
      }

      return false;
    };

    // Auto-show checkout form if:
    // 1. We're on delivery or payment step (clearly in checkout)
    // 2. We're on personal step but have an active checkout session
    if (currentStep === 'delivery' || currentStep === 'payment') {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setShowCheckout(true), 0);
    } else if (currentStep === 'personal' && hasActiveCheckoutSession()) {
      // User started checkout (clicked "К оформлению") but is on personal step
      setTimeout(() => setShowCheckout(true), 0);
    }
  }, [currentStep]);

  const handleQuantityChange = (id: string | number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string | number) => {
    removeItem(id);
  };

  const handleCouponApply = (code: string) => {
    // TODO: Implement coupon application logic
    console.log('Applying coupon:', code);
  };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  const total = getTotalPrice().toString();

  return (
    <Section noPadding className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Корзина</h1>
        <div className={styles.content}>
          <div className={styles.itemsSection}>
            {items.length > 0
              ? (
                  <>
                    <div className={styles.itemsList}>
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          {...item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                    {showCheckout && (
                      <div className={styles.totalSection}>
                        <div className={styles.totalRow}>
                          <span className={styles.totalLabel}>Общая стоимость</span>
                          <span className={`large-bold ${styles.totalAmount}`}>
                            {formatPrice(total, '₽')}
                          </span>
                        </div>
                      </div>
                    )}
                    <CouponInput onApply={handleCouponApply} className={styles.couponInput} />
                  </>
                )
              : (
                  <div className={styles.emptyState}>
                    <p>Ваша корзина пуста</p>
                  </div>
                )}
          </div>
          {items.length > 0 && (
            <div className={styles.checkoutSection}>
              {showCheckout
                ? (
                    <CheckoutForm />
                  )
                : (
                    <OrderSummary total={total} currency="₽" onCheckoutClick={handleCheckoutClick} />
                  )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
