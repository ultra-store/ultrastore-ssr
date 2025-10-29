import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import type { Product } from '@/shared/types/types';

import type { WithClassName } from '@/shared/types/utils';

import { formatPrice } from '@/shared/utils/format-price';

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
  slug,
  category_slug,
}: WithClassName<ProductCardProps>) => {
  const displayPrice = on_sale && sale_price ? sale_price : price;
  const formattedPrice = formatPrice(displayPrice, currency);
  const formattedRegularPrice = regular_price ? formatPrice(regular_price, currency) : null;

  const content = (
    <div className={styles.content}>
      <div className={styles.media}>
        <Image src={image || '/placeholder-product.png'} alt={name} width={300} height={300} />
      </div>

      <div className={styles.info}>
        <div className={`secondary-bold ${styles.title}`}>{name}</div>
        <div className={styles.priceContainer}>
          <span className={`number outline-primary ${styles.price} ${on_sale ? styles.salePrice : ''}`}>{formattedPrice}</span>
          {on_sale && formattedRegularPrice && (
            <span className={`number outline-initial ${styles.regularPrice}`}>{formattedRegularPrice}</span>
          )}
        </div>
      </div>
    </div>
  );

  const productLink = category_slug ? `/${category_slug}/${slug}` : `/product/${slug}`;

  return (
    <article className={`${styles.card} ${className}`} aria-label={name}>
      <Link href={productLink} className={styles.overlayLink} aria-label={`Перейти к ${name}`} />
      <div className={styles.cardWrapper}>
        {content}
        <Button variant="primary" fullWidth className={styles.button}>В корзину</Button>
      </div>
    </article>
  );
};
