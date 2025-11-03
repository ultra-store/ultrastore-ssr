'use client';

import Image from 'next/image';

import { IconButton } from '@/components/ui/icon-button';
import icons from '@/shared/icons';
import { formatPrice } from '@/shared/utils/format-price';

import { QuantitySelector } from '../quantity-selector';

import styles from './cart-item.module.css';

export interface CartItemProps {
  id: string | number
  name: string
  image?: string
  price: string
  quantity: number
  onQuantityChange: (id: string | number, quantity: number) => void
  onRemove: (id: string | number) => void
  currency?: string
}

export const CartItem = ({
  id,
  name,
  image,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  currency = '₽',
}: CartItemProps) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const formattedPrice = formatPrice(price, currency);

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        <Image
          src={image || '/placeholder-product.png'}
          alt={name}
          width={100}
          height={100}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          <div className={`number ${styles.price}`}>{formattedPrice}</div>
        </div>
        <div className={styles.actions}>
          <IconButton
            icon={icons.close}
            alt="Удалить товар"
            onClick={handleRemove}
            className={styles.deleteButton}
            aria-label="Удалить товар из корзины"
          />
          <QuantitySelector
            quantity={quantity}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
            min={1}
          />
        </div>
      </div>
    </div>
  );
};
