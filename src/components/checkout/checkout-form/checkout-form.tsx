'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { submitOrder } from '@/shared/api/submitOrder';
import { useCart } from '@/shared/context/cart-context';
import { useCheckout } from '@/shared/context/checkout-context';
import { saveUserDataFromCheckout } from '@/shared/utils/user-data-storage';

import { CheckoutProgress } from '../checkout-progress';
import { DeliveryStep } from '../delivery-step';
import { PaymentStep } from '../payment-step';
import { PersonalDataStep } from '../personal-data-step';

import styles from './checkout-form.module.css';

export const CheckoutForm = () => {
  const router = useRouter();
  const { currentStep, setStep, canProceedToNextStep, checkoutData, resetCheckout } = useCheckout();
  const { clearCart, items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!canProceedToNextStep()) {
      return;
    }

    switch (currentStep) {
      case 'personal':
        setStep('delivery');
        break;
      case 'delivery':
        setStep('payment');
        break;
      case 'payment':
        handleSubmit();
        break;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNextStep() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit order to WooCommerce
      const order = await submitOrder(checkoutData, items);

      console.log('Order created successfully:', order);

      // Save user data for future orders
      saveUserDataFromCheckout(
        checkoutData.personal,
        {
          address: checkoutData.delivery.address,
          phone: checkoutData.delivery.phone,
        },
      );

      // Clear cart and checkout data
      clearCart();
      resetCheckout();

      // Set cookie to allow access to order-success page
      document.cookie = 'ultrastore_order_success=true; path=/; max-age=60';

      // Redirect to success page with order ID
      router.push(`/order-success?orderId=${order.id}`);
    } catch (err) {
      console.error('Failed to submit order:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalDataStep />;
      case 'delivery':
        return <DeliveryStep />;
      case 'payment':
        return <PaymentStep />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Оформление</h2>
        <CheckoutProgress />
      </div>
      <div className={styles.content}>
        {renderStepContent()}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        {currentStep === 'payment'
          ? (
              <Button
                variant="primary"
                fullWidth
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={!canProceedToNextStep() || isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
              </Button>
            )
          : (
              <Button
                variant="primary"
                fullWidth
                className={styles.nextButton}
                onClick={handleNext}
                disabled={!canProceedToNextStep()}
              >
                Далее
              </Button>
            )}
      </div>
    </div>
  );
};
