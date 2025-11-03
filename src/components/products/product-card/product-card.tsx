'use client';

import Image from 'next/image';
import Link from 'next/link';

import { QuantitySelector } from '@/components/cart/quantity-selector';
import { Button } from '@/components/ui/button';
import { useCart } from '@/shared/context/cart-context';
import icons from '@/shared/icons';
import type { Product } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';
import { formatPrice } from '@/shared/utils/format-price';
import { normalizeCurrency } from '@/shared/utils/normalize-currency';

import styles from './product-card.module.css';

export interface ProductCardProps extends Product {
  id: number
  name: string
  link?: string
  image?: string
  price: string
  currency?: string
  regular_price?: string
  sale_price?: string
  on_sale?: boolean
  variation_slug?: string
  showPricePrefix?: boolean
}

export const ProductCard = ({
  id,
  name,
  image,
  price,
  currency = '₽',
  className,
  sale_price,
  on_sale,
  slug,
  category_slug,
  link,
  showPricePrefix = false,
  has_variations = false,
  in_stock,
}: WithClassName<ProductCardProps>) => {
  const { addItem, getCartItem, updateQuantity } = useCart();
  const normalizedCurrency = normalizeCurrency(currency);
  const displayPrice = on_sale && sale_price ? sale_price : price;
  const formattedPrice = formatPrice(displayPrice, normalizedCurrency);
  // Показываем префикс "от..." только если товар имеет вариации
  const pricePrefix = (showPricePrefix && has_variations) ? 'от ' : '';

  // Check if product is already in cart
  const cartItem = getCartItem(id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (in_stock !== false && !isInCart) {
      // Generate cart item ID using the same logic as cart-context
      const cartItemId = String(id);

      addItem({
        id: cartItemId,
        productId: id,
        name,
        image,
        price: displayPrice,
        currency: normalizedCurrency,
      });
    }
  };

  const handleDecrement = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const handleIncrement = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const content = (
    <div className={styles.content}>
      <div className={styles.media}>
        <Image src={image || '/placeholder-product.png'} alt={name} width={300} height={300} />
      </div>

      <div className={styles.info}>
        <div className={`secondary-bold ${styles.title}`}>{name}</div>
        <div className={styles.priceContainer}>
          <span className={`number outline-primary ${styles.price} ${on_sale ? styles.salePrice : ''}`}>
            {pricePrefix}
            {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );

  // Normalize link from API - convert absolute URL to relative path
  const normalizeLink = (url?: string): string | null => {
    if (!url) {
      return null;
    }

    try {
      // If it's already a relative path, return as is
      if (url.startsWith('/')) {
        return url;
      }

      // Parse absolute URL and extract path
      const urlObj = new URL(url);
      let path = urlObj.pathname;

      // Remove trailing slash
      if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
      }

      return path;
    } catch {
      // If URL parsing fails, return null to use fallback
      return null;
    }
  };

  // Use normalized link from API if available, otherwise construct from slug
  // Link already contains variation slug if present: "iphone-17-pro-max/cosmic-orange-sim-esim-256"
  const normalizedLink = normalizeLink(link);
  const productLink = normalizedLink || (category_slug ? `/${category_slug}/${slug}` : `/product/${slug}`);

  return (
    <article className={`${styles.card} ${className}`} aria-label={name}>
      <Link href={productLink} className={styles.overlayLink} aria-label={`Перейти к ${name}`} />
      <div className={styles.cardWrapper}>
        {content}
        <div className={styles.cartControls}>
          {has_variations
            ? (
                in_stock === false
                  ? (
                      <Button
                        variant="primary"
                        fullWidth
                        className={styles.button}
                        disabled
                      >
                        Нет в наличии
                      </Button>
                    )
                  : (
                      <Link href={productLink} className={styles.cartLink}>
                        <Button
                          variant="primary"
                          fullWidth
                          className={styles.button}
                          aria-label={`Перейти к ${name} для выбора конфигурации`}
                        >
                          Выбрать
                        </Button>
                      </Link>
                    )
              )
            : (
                isInCart
                  ? (
                      <>
                        <QuantitySelector
                          quantity={cartItem.quantity}
                          onDecrement={handleDecrement}
                          onIncrement={handleIncrement}
                          className={styles.quantitySelector}
                        />
                        <Link href="/cart" className={styles.cartLink}>
                          <Button variant="secondary" className={styles.iconButton} icon={icons.cart} aria-label="В корзине">
                            <span className={styles.srOnly}>В корзине</span>
                          </Button>
                        </Link>
                      </>
                    )
                  : (
                      <Button
                        variant="primary"
                        fullWidth
                        className={styles.button}
                        onClick={handleAddToCart}
                        disabled={in_stock === false}
                      >
                        {in_stock === false ? 'Нет в наличии' : 'В корзину'}
                      </Button>
                    )
              )}
        </div>
      </div>
    </article>
  );
};
