import Image from 'next/image';

import { Button } from '@/components/ui/button';

import styles from './product-card.module.css';

export interface ProductCardProps {
  id: number
  name: string
  link?: string
  image?: string
  price: string
}

export const ProductCard = ({ name, image, price }: ProductCardProps) => {
  return (
    <article className={styles.card} aria-label={name}>
      <div className={styles.media}>
        <Image src={image || '/placeholder-product.png'} alt={name} width={300} height={300} />
      </div>

      <div className={styles.title}>{name}</div>
      <div className={styles.price}>{price}</div>

      <Button variant="primary" fullWidth>В корзину</Button>
    </article>
  );
};
