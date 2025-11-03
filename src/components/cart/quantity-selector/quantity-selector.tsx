'use client';

import styles from './quantity-selector.module.css';

interface QuantitySelectorProps {
  quantity: number
  onDecrement: () => void
  onIncrement: () => void
  min?: number
  max?: number
  className?: string
}

export const QuantitySelector = ({
  quantity,
  onDecrement,
  onIncrement,
  min = 1,
  max,
  className = '',
}: QuantitySelectorProps) => {
  const canDecrement = quantity > min;
  const canIncrement = max === undefined || quantity < max;

  return (
    <div className={`${styles.selector} ${className}`}>
      <button
        type="button"
        className={styles.button}
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label="Уменьшить количество"
      >
        –
      </button>
      <span className={styles.quantity}>{quantity}</span>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
};
