import Image from 'next/image';

import { Button } from '@/components/ui/button';

import type { Product } from '@/shared/types/types';

import styles from './product-card.module.css';

export interface ProductCardProps extends Product {
  id: number
  name: string
  link?: string
  image?: string
  price: string
  currency?: string
}

export const ProductCard = ({ name, image, price, currency = '₽' }: ProductCardProps) => {
  return (
    <article className={styles.card} aria-label={name}>
      <div className={styles.media}>
        <Image src={image || '/placeholder-product.png'} alt={name} width={300} height={300} />
      </div>

      <div className={styles.title}>{name}</div>
      <div className={styles.price}>{`${price} ${currency}`}</div>

      <Button variant="primary" fullWidth>В корзину</Button>
    </article>
  );
};
