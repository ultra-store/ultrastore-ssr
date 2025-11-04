'use client';

import { useState } from 'react';

import Link from 'next/link';

import { QuantitySelector } from '@/components/cart/quantity-selector';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { features } from '@/shared/config/features';
import { useCart } from '@/shared/context/cart-context';
import icons from '@/shared/icons';
import type { ProductDetails, ProductVariation } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';

import { ProductPrice } from '../product-price/product-price';

import styles from './product-actions.module.css';

export interface ProductActionsProps {
  price: string
  onSale: boolean
  inStock: boolean
  product?: ProductDetails
  variation?: ProductVariation | null
}

export const ProductActions = ({
  price,
  onSale,
  inStock,
  product,
  variation,
  className,
}: WithClassName<ProductActionsProps>) => {
  const { addItem, getCartItem, updateQuantity } = useCart();
  const comparisonEnabled = features.comparison.enabled;
  const favoritesEnabled = features.favorites.enabled;

  const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  const [isComparisonActive, setIsComparisonActive] = useState(false);

  // Check if product is already in cart
  const cartItem = product ? getCartItem(product.id, variation?.slug, variation?.id) : undefined;
  const isInCart = !!cartItem;

  return (
    <Section noPadding className={className}>
      <ProductPrice price={price} onSale={onSale} variant="desktop" />

      <div className={styles.actions}>
        <div className={styles.mainActions}>
          {isInCart
            ? (
                <div className={styles.cartState}>
                  <QuantitySelector
                    quantity={cartItem.quantity}
                    onDecrement={() => {
                      if (cartItem && cartItem.quantity > 1) {
                        updateQuantity(cartItem.id, cartItem.quantity - 1);
                      }
                    }}
                    onIncrement={() => {
                      if (cartItem) {
                        updateQuantity(cartItem.id, cartItem.quantity + 1);
                      }
                    }}
                    className={styles.quantitySelector}
                  />
                  <Link href="/cart" className={styles.cartLink}>
                    <Button variant="secondary" className={styles.iconButton} icon={icons.cart} aria-label="В корзине">
                      <span className={styles.srOnly}>В корзине</span>
                    </Button>
                  </Link>
                </div>
              )
            : (
                <Button
                  variant="primary"
                  disabled={!inStock}
                  className={styles.addToCartButton}
                  onClick={() => {
                    if (product && inStock) {
                      const displayPrice = variation
                        ? (variation.on_sale && variation.sale_price ? variation.sale_price : variation.price)
                        : (product.on_sale && product.sale_price ? product.sale_price : product.price);

                      // Generate cart item ID using the same logic as cart-context
                      const cartItemId = variation?.slug
                        ? `${product.id}_${variation.slug}`
                        : variation?.id
                          ? `${product.id}_variation_${variation.id}`
                          : String(product.id);

                      addItem({
                        id: cartItemId,
                        productId: product.id,
                        name: product.name,
                        image: product.images?.[0]?.url || product.image,
                        price: displayPrice,
                        currency: product.currency || '₽',
                        variationSlug: variation?.slug,
                        variationId: variation?.id,
                      });
                    }
                  }}
                >
                  {inStock ? 'В корзину' : 'Нет в наличии'}
                </Button>
              )}

          {(favoritesEnabled || comparisonEnabled) && (
            <div className={styles.iconButtons}>
              {favoritesEnabled && (
                <Button
                  icon={icons.favorite}
                  aria-label="В избранное"
                  variant="outline-secondary"
                  active={isFavoriteActive}
                  className={styles.iconButton}
                  onClick={() => setIsFavoriteActive(!isFavoriteActive)}
                >
                  <span className={styles.srOnly}>В избранное</span>
                </Button>
              )}
              {comparisonEnabled && (
                <Button
                  icon={icons.comparison}
                  aria-label="Сравнить"
                  variant="outline-secondary"
                  active={isComparisonActive}
                  className={styles.iconButton}
                  onClick={() => setIsComparisonActive(!isComparisonActive)}
                >
                  <span className={styles.srOnly}>Сравнить</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {
          inStock && (
            <Button
              variant="outline"
              disabled={!inStock}
              className={styles.buyOneClickButton}
            >
              Купить в 1 клик
            </Button>
          )
        }
      </div>
    </Section>
  );
};
