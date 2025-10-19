import Image from 'next/image';

import { Button } from '@/components/ui/button';

import type { Product } from '@/shared/types/types';

import type { WithClassName } from '@/shared/types/utils';

import { useFormattedPrice } from '@/shared/utils/format-price';

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
}

export const ProductCard = ({
  name,
  image,
  price,
  currency = '₽',
  className,
  regular_price,
  sale_price,
  on_sale,
}: WithClassName<ProductCardProps>) => {
  const formattedPrice = useFormattedPrice(price, currency, regular_price, sale_price, on_sale);

  return (
    <article className={`${styles.card} ${className}`} aria-label={name}>
      <div className={styles.content}>
        <div className={styles.media}>
          <Image src={image || '/placeholder-product.png'} alt={name} width={300} height={300} />
        </div>

        <div className={styles.info}>
          <div className={`secondary-bold ${styles.title}`}>{name}</div>
          <div className={`number ${styles.price}`}>{formattedPrice}</div>
        </div>
      </div>

      <Button variant="primary" fullWidth>В корзину</Button>
    </article>
  );
};
