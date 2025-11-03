'use client';

import type { DeliveryOption } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './product-delivery.module.css';

export interface ProductDeliveryProps { deliveryOptions: DeliveryOption[] }

export const ProductDelivery = ({
  deliveryOptions,
  className,
}: WithClassName<ProductDeliveryProps>) => {
  if (!deliveryOptions || deliveryOptions.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {deliveryOptions.map((option) => (
        <div key={option.type} className={styles.option}>
          <div className={styles.title}>{option.title}</div>
          <div className={styles.details}>
            {option.description && (
              <span className={styles.description}>{option.description}</span>
            )}
            {option.price && (
              <span className={styles.price}>{option.price}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
