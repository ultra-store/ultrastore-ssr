'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { CartItem, CartTotal, CouponInput, OrderSummary } from '@/components/cart';
import { CheckoutForm } from '@/components/checkout';
import { RelatedProducts } from '@/components/product/related-products';
import { Message } from '@/components/ui/message';
import { Section } from '@/components/ui/section';
import { getCartRelatedProducts } from '@/shared/api/getCartRelatedProducts';
import { getHomepageData } from '@/shared/api/getHomepageData';
import { useCart } from '@/shared/context/cart-context';
import { useCheckout } from '@/shared/context/checkout-context';
import icons from '@/shared/icons';
import type { Product } from '@/shared/types';

import styles from './page.module.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { currentStep } = useCheckout();
  const [showCheckout, setShowCheckout] = useState(false);
  const [justCleared, setJustCleared] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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

  const handleClearCart = () => {
    clearCart();

    // trigger success animation briefly
    setJustCleared(true);
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setTimeout(() => {
      setJustCleared(false);
      timerRef.current = null;
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const total = getTotalPrice().toString();

  // Load related products for items in the cart
  useEffect(() => {
    if (!items || items.length === 0) {
      // Defer to avoid synchronous setState warning from lint rule
      setTimeout(() => setRelated([]), 0);

      return;
    }

    const controller = new AbortController();

    abortRef.current?.abort();
    abortRef.current = controller;

    const productIds = Array.from(new Set(items.map((i) => i.productId)));

    getCartRelatedProducts(productIds, 8, { signal: controller.signal })
      .then((products) => setRelated(products || []))
      .catch(() => setRelated([]));

    return () => controller.abort();
  }, [items]);

  // Load recommended products when cart is empty
  useEffect(() => {
    if (items && items.length === 0) {
      const loadRecommendedProducts = async () => {
        try {
          const homepageData = await getHomepageData();

          // Use new products first, then sale products
          if (homepageData.new_products && homepageData.new_products.length > 0) {
            const products = homepageData.new_products.slice(0, 5);

            setTimeout(() => setRecommendedProducts(products), 0);
          } else if (homepageData.sale_products && homepageData.sale_products.length > 0) {
            const products = homepageData.sale_products.slice(0, 5);

            setTimeout(() => setRecommendedProducts(products), 0);
          } else {
            setTimeout(() => setRecommendedProducts([]), 0);
          }
        } catch {
          // If failed to load products, just don't show them
          setTimeout(() => setRecommendedProducts([]), 0);
        }
      };

      loadRecommendedProducts();
    } else {
      // Defer to avoid synchronous setState warning from lint rule
      setTimeout(() => setRecommendedProducts([]), 0);
    }
  }, [items]);

  const clearCartButton = (
    <button className={styles.clearButton} onClick={handleClearCart} aria-label="Очистить корзину">
      <span className={styles.clearIconWrap}>
        <Image src={justCleared ? icons.checkmark : icons.close} alt={justCleared ? 'Готово' : 'Очистить'} width={25} height={25} className={justCleared ? styles.checkmarkIcon : ''} />
      </span>
      <span className={`large text-primary ${styles.clearLabel}`} data-success={justCleared}>Очистить корзину</span>
    </button>
  );

  const isEmpty = items.length === 0;

  return (
    <>
      <Section className={isEmpty ? styles.emptyContainer : styles.container}>
        {isEmpty
          ? (
              <Section noPadding>
                <Message
                  title="Корзина"
                  description="Вы еще ничего не добавили в корзину"
                />
              </Section>
            )
          : (
              <Section noPadding title="Корзина" titleAction={clearCartButton}>
                <div className={styles.itemsSection}>
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
                    <CartTotal total={total} currency="₽" />
                  )}
                  <CouponInput onApply={handleCouponApply} className={styles.couponInput} />
                </div>
              </Section>
            )}
        {!isEmpty && (
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
      </Section>
      {!isEmpty && related.length > 0 && (
        <Section noPadding>
          <RelatedProducts products={related} title="Берут вместе" />
        </Section>
      )}
      {isEmpty && recommendedProducts.length > 0 && (
        <Section noPadding>
          <RelatedProducts products={recommendedProducts} title="Может понравиться" />
        </Section>
      )}
    </>
  );
}
