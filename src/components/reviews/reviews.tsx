import { LongButton } from '@/components/ui/long-button';
import { Section } from '@/components/ui/section';
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
    <Section title={title} ariaLabel={title}>
      <div className={styles.row}>
        {firstFour.map((r) => (
          <ReviewCard key={r.id} {...r} />
        ))}
      </div>

      <LongButton asButton>
        Оставить свой отзыв →
      </LongButton>
    </Section>
  );
};
