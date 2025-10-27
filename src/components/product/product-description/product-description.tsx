'use client';

import { useMemo, useState } from 'react';

import type { Review, ProductAttribute, ProductDimensions } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './product-description.module.css';

export interface ProductDescriptionProps {
  shortDescription?: string
  description?: string
  attributes?: ProductAttribute[]
  sku?: string
  weight?: string
  dimensions?: ProductDimensions
  reviews?: Review[]
}

export const ProductDescription = ({
  shortDescription,
  description,
  attributes,
  sku,
  weight,
  dimensions,
  reviews,
  className,
}: WithClassName<ProductDescriptionProps>) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const specsRows = useMemo(() => {
    const rows: {
      label: string
      value: string
    }[] = [];

    if (sku) {
      rows.push({
        label: 'Артикул',
        value: sku,
      });
    }

    if (weight) {
      rows.push({
        label: 'Вес',
        value: weight,
      });
    }

    if (dimensions) {
      const { length, width, height } = dimensions;
      const parts = [length, width, height].filter(Boolean).join(' × ');

      if (parts) {
        rows.push({
          label: 'Габариты',
          value: parts,
        });
      }
    }

    (attributes || []).forEach((attr) => {
      const value = attr.values.map((v) => v.name).join(', ');

      if (value) {
        rows.push({
          label: attr.name,
          value,
        });
      }
    });

    return rows;
  }, [sku, weight, dimensions, attributes]);

  const hasReviews = Boolean(reviews && reviews.length > 0);

  const specsContent = specsRows.length > 0
    ? (
        <div className={styles.specsTable}>
          {specsRows.map((row, idx) => (
            <div key={`${row.label}-${idx}`} className={styles.specRow}>
              <div className={styles.specLabel}>{row.label}</div>
              <div className={styles.specValue}>{row.value}</div>
            </div>
          ))}
        </div>
      )
    : (
        <div className={styles.empty}>Характеристики не указаны</div>
      );

  const reviewsContent = hasReviews
    ? (
        <div className={styles.reviewsPlaceholder}>
          В этом разделе скоро появятся отзывы о товаре
        </div>
      )
    : (
        <div className={styles.empty}>Отзывов пока нет</div>
      );

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.tabs} role="tablist" aria-label="Описание товара">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'description'}
          className={`${styles.tabButton} ${activeTab === 'description' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Описание
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'specs'}
          className={`${styles.tabButton} ${activeTab === 'specs' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Характеристики
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'reviews'}
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Отзывы покупателей
        </button>
      </div>

      {activeTab === 'description' && (
        <div className={styles.tabPanel} role="tabpanel">
          {shortDescription && (
            <div
              className={`${styles.shortDescription} ${styles.text}`}
              dangerouslySetInnerHTML={{ __html: shortDescription }}
            />
          )}

          {description && (
            <div
              className={`${styles.description} ${styles.text}`}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      )}

      {activeTab === 'specs' && (
        <div className={styles.tabPanel} role="tabpanel">{specsContent}</div>
      )}

      {activeTab === 'reviews' && (
        <div className={styles.tabPanel} role="tabpanel">{reviewsContent}</div>
      )}
    </div>
  );
};
