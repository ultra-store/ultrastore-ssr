'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { ReviewCard } from '@/components/reviews/review-card/review-card';
import { LongButton } from '@/components/ui/long-button';

import type {
  ProductAttribute,
  ProductAttributeGroup,
  ProductAttributes,
  ProductDimensions,
  ProductVariation,
  Review,
} from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';
import { applyTypografToHTML } from '@/shared/utils/typograf';

import { ProductSpecs } from '../product-specs';

import styles from './product-description.module.css';

type TabType = 'description' | 'specs' | 'reviews';

// Map query parameter values to tab names
const queryToTab: Record<string, TabType> = {
  description: 'description',
  specs: 'specs',
  reviews: 'reviews',
};

export interface ProductDescriptionProps {
  shortDescription?: string
  attributes?: ProductAttributes
  variations?: ProductVariation[]
  sku?: string
  weight?: string
  dimensions?: ProductDimensions
  reviews?: Review[]
}

export const ProductDescription = ({
  shortDescription,
  attributes,
  variations,
  sku,
  weight,
  dimensions,
  reviews,
  className,
}: WithClassName<ProductDescriptionProps>) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize active tab from URL on mount
  const getTabFromUrl = useCallback((): TabType => {
    const tabParam = searchParams?.get('tab');

    return queryToTab[tabParam || ''] || 'description';
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Initialize from URL on mount
    const tabParam = searchParams?.get('tab');

    return queryToTab[tabParam || ''] || 'description';
  });

  // Sync activeTab with URL changes (e.g., from browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getTabFromUrl]);

  // Handle tab click with query parameter update (no scrolling)
  const handleTabClick = useCallback((tab: TabType) => {
    // Update local state immediately for responsive UI
    setActiveTab(tab);

    // Update URL with query parameter without scrolling using History API
    // This avoids triggering Next.js router navigation and component remounting
    // Read current URL params directly from window.location to avoid dependency on searchParams
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(currentSearch);

    if (tab === 'description') {
      // Remove tab parameter for default tab to keep URL clean
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }

    // Build URL with query params (only add ? if there are params)
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (typeof window !== 'undefined') {
      // Use History API to update URL without reloading the page or remounting components
      window.history.replaceState(
        {
          ...window.history.state,
          as: newUrl,
          url: newUrl,
        },
        '',
        newUrl,
      );
    }
  }, [pathname]);

  // Helper to check if attributes is a grouped format
  const isAttributeGroup = useCallback((
    attrs: ProductAttributes,
  ): attrs is ProductAttributeGroup[] => {
    if (!attrs || attrs.length === 0) {
      return false;
    }

    return 'group' in attrs[0] && 'attributes' in attrs[0];
  }, []);

  // Helper function to convert attribute slug to variation attribute key
  // API format: variation key = "pa_" + attribute slug
  const getVariationAttrKey = useCallback((attrSlug: string): string => {
    return `pa_${attrSlug}`;
  }, []);

  // Determine which attributes are used for variations
  const variationAttributes = useMemo(() => {
    if (!variations || variations.length === 0) {
      return new Set<string>();
    }

    const variationAttrKeys = new Set<string>();

    variations.forEach((variation) => {
      if (variation.attributes && typeof variation.attributes === 'object') {
        Object.keys(variation.attributes).forEach((key) => {
          variationAttrKeys.add(key.toLowerCase());
        });
      }
    });

    return variationAttrKeys;
  }, [variations]);

  // Check if an attribute is used for variations
  const isAttributeUsedForVariations = useMemo(() => {
    return (attr: ProductAttribute): boolean => {
      // First check the used_for_variations flag if available
      if (attr.used_for_variations !== undefined) {
        return attr.used_for_variations;
      }

      // Fallback: check if attribute slug matches any variation key
      const variationKey = getVariationAttrKey(attr.slug);

      return variationAttributes.has(variationKey.toLowerCase());
    };
  }, [variationAttributes, getVariationAttrKey]);

  // Filter to get only specification attributes (not used for variations)
  const specAttributes = useMemo(() => {
    if (!attributes) {
      return undefined;
    }

    if (isAttributeGroup(attributes)) {
      // For grouped attributes, filter each group
      return attributes.map((group) => ({
        ...group,
        attributes: group.attributes.filter((attr) => !isAttributeUsedForVariations(attr)),
      })).filter((group) => group.attributes.length > 0);
    }

    // For flat array, filter directly
    return (attributes as ProductAttribute[]).filter((attr) => !isAttributeUsedForVariations(attr));
  }, [attributes, isAttributeGroup, isAttributeUsedForVariations]);

  // Get current variation from URL pathname (used for SKU display)
  const currentVariation = useMemo(() => {
    if (!variations || variations.length === 0) {
      return null;
    }

    // Extract last segment from pathname (could be variation slug)
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Check if last segment matches any variation slug
    return variations.find((v) => v.slug === lastSegment) || null;
  }, [pathname, variations]);

  const hasReviews = Boolean(reviews && reviews.length > 0);

  const reviewsContent = hasReviews && reviews
    ? (
        <div className={styles.reviewsContainer}>
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
          <div className={styles.reviewsButton}>
            <LongButton asButton>
              Оставить свой отзыв →
            </LongButton>
          </div>
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
          onClick={() => handleTabClick('description')}
        >
          <span className={styles.tabText}>Описание</span>
          <span className={`${styles.tabUnderline} ${activeTab === 'description' ? styles.tabUnderlineVisible : ''}`} />
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'specs'}
          data-tab="specs"
          className={`${styles.tabButton} ${activeTab === 'specs' ? styles.tabActive : ''}`}
          onClick={() => handleTabClick('specs')}
        >
          <span className={styles.tabText}>Характеристики</span>
          <span className={`${styles.tabUnderline} ${activeTab === 'specs' ? styles.tabUnderlineVisible : ''}`} />
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'reviews'}
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
          onClick={() => handleTabClick('reviews')}
        >
          <span className={styles.tabText}>Отзывы покупателей</span>
          <span className={`${styles.tabUnderline} ${activeTab === 'reviews' ? styles.tabUnderlineVisible : ''}`} />
        </button>
      </div>

      {activeTab === 'description' && (
        <div className={styles.tabPanel} role="tabpanel">
          {shortDescription
            ? (
                <div
                  className={`${styles.shortDescription} ${styles.text}`}
                  dangerouslySetInnerHTML={{ __html: applyTypografToHTML(shortDescription) }}
                />
              )
            : (
                <div className={styles.empty}>Описание не указано</div>
              )}
        </div>
      )}

      {activeTab === 'specs' && (
        <div id="product-specs" className={styles.tabPanel} role="tabpanel">
          <ProductSpecs
            attributes={specAttributes}
            sku={sku}
            weight={weight}
            dimensions={dimensions}
            currentVariationSku={currentVariation?.sku}
          />
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className={styles.tabPanel} role="tabpanel">{reviewsContent}</div>
      )}
    </div>
  );
};
