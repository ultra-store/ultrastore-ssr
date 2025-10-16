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
      aria-label={alt_text || title || 'Промо'}
      target={new_tab ? '_blank' : undefined}
      rel={new_tab ? 'noopener noreferrer' : undefined}
      style={bg_color ? { background: bg_color } : undefined}
    >
      {/* Using Next Image for optimization even with full-bleed background */}
      <Image
        src={image || '/placeholder-product.png'}
        alt={alt_text || title || ''}
        fill
        className={styles.bannerImage}
        sizes="(max-width: 768px) 90vw, 335px"
        priority
      />
    </Link>
  );
};
