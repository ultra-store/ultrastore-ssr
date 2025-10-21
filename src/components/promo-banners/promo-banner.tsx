import Image from 'next/image';
import Link from 'next/link';

import type { PromoBanner as PromoBannerType } from '@/shared/types';

import styles from './promo-banners.module.css';

export type PromoBannerProps = PromoBannerType;

export const PromoBanner = ({ link, image, alt_text, new_tab, bg_color, title }: PromoBannerProps) => {
  return (
    <Link
      href={link || '#'}
      className={styles.banner}
      aria-label={alt_text || title || 'Акционные предложения'}
      target={new_tab ? '_blank' : undefined}
      rel={new_tab ? 'noopener noreferrer' : undefined}
      style={bg_color ? { background: bg_color } : undefined}
    >
      <Image
        src={image || '/placeholder-product.png'}
        alt={alt_text || title || ''}
        fill
        className={styles.bannerImage}
        sizes="(max-width: 759px) 35vw, (min-width: 1920px) 400px, (min-width: 1600px) 360px, (min-width: 1280px) 320px, 280px"
        priority
      />
    </Link>
  );
};
