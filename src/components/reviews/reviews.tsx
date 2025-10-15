import type { Review } from '@/shared/types';

import { ReviewCard } from './review-card/review-card';

import styles from './reviews.module.css';

export interface ReviewsProps {
  title?: string
  items?: Review[]
}

export const Reviews = ({ title = 'Отзывы', items }: ReviewsProps) => {
  if (!items?.length) {
    return null;
  }

  const firstFour = items.slice(0, 4);

  return (
    <section className={styles.section} aria-label={title}>
      <h2 className={`heading-1 ${styles.title}`}>{title}</h2>
      <div className={styles.row}>
        {firstFour.map((r) => (
          <ReviewCard key={r.id} {...r} />
        ))}
      </div>

      <button type="button" className={styles.cta} aria-label="Оставить свой отзыв">
        <span className={styles.ctaText}>Оставить свой отзыв →</span>
      </button>
    </section>
  );
};
