import { PromoBanner, type PromoBannerProps } from './promo-banner';

import styles from './promo-banners.module.css';

export interface PromoBannersProps { items?: PromoBannerProps[] }

export const PromoBanners = ({ items }: PromoBannersProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <section className={`section ${styles.section}`} aria-label="Промо баннеры">
      <div className={styles.row}>
        {items.map((b, idx) => (
          <PromoBanner key={idx} {...b} />
        ))}
      </div>
    </section>
  );
};
