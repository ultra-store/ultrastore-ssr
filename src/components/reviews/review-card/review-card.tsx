import Link from 'next/link';

import type { Review } from '@/shared/types';

import styles from './review-card.module.css';

export type ReviewCardProps = Review;

export const ReviewCard = ({
  id,
  title,
  author_name,
  rating = 5,
  source,
  source_url,
  text,
  excerpt,
}: ReviewCardProps) => {
  const reviewText = text || excerpt || '';
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  const authorName = author_name?.split(' ').slice(0, 1).join('') || '';

  return (
    <article className={styles.card} aria-label={title}>
      <h3 className={styles.name}>{authorName || title}</h3>

      <div className={styles.meta}>
        <div className={styles.stars} aria-label={`Рейтинг ${safeRating} из 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} aria-hidden>
              {i < safeRating ? '★' : '☆'}
            </span>
          ))}
        </div>
        {source && (
          <div>
            {source_url
              ? (
                  <Link href={source_url} target="_blank" rel="noopener noreferrer" className={styles.source}>
                    {source}
                  </Link>
                )
              : (
                  <span className={styles.source}>{source}</span>
                )}
          </div>
        )}
      </div>

      {reviewText && <p className={styles.text}>{reviewText}</p>}
      <Link href={`#review-${id}`} className={styles.more}>
        Показать полностью
      </Link>
    </article>
  );
};
