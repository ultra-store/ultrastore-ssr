'use client';

import { useCallback, useMemo, useState } from 'react';

import { Section } from '@/components/ui/section';

import type { ProductDetails, ProductImage, ProductVariation } from '@/shared/types/types';
import { formatPrice } from '@/shared/utils/format-price';
import { normalizeCurrency } from '@/shared/utils/normalize-currency';

import { ProductHeader } from '../product-header/product-header';
import { ProductImageGallery } from '../product-image-gallery';
import { ProductInfo } from '../product-info';
import { ProductPrice } from '../product-price/product-price';

import styles from './product-view.module.css';

export interface ProductViewProps {
  images: ProductImage[]
  name: string
  product: ProductDetails
  initialVariationSlug?: string
}

// Helper function to compare two image arrays by URL
const areImagesEqual = (images1: ProductImage[], images2: ProductImage[]): boolean => {
  if (images1.length !== images2.length) {
    return false;
  }

  return images1.every((img1, index) => {
    const img2 = images2[index];

    return img1.url === img2.url && img1.id === img2.id;
  });
};

export const ProductView = ({
  images,
  name,
  product,
  initialVariationSlug,
}: ProductViewProps) => {
  const [variationImages, setVariationImages] = useState<ProductImage[] | null>(null);
  const [currentVariationSku, setCurrentVariationSku] = useState<string | null | undefined>(product?.sku);
  const [currentPrice, setCurrentPrice] = useState<string>(() => {
    const currency = normalizeCurrency(product.currency || '₽');
    const displayPrice = product.on_sale && product.sale_price ? product.sale_price : product.price;

    return formatPrice(displayPrice, currency);
  });
  const [currentOnSale, setCurrentOnSale] = useState<boolean>(!!product.on_sale);

  // Use variation images if available, otherwise fall back to parent product images
  // Parent images are used when:
  // 1. No variation is selected
  // 2. Selected variation has no images (even after checking same-color variations)
  const displayImages = useMemo(() => {
    if (variationImages) {
      // If variation images are same as product images, return product images reference
      if (areImagesEqual(variationImages, images)) {
        return images;
      }

      return variationImages;
    }

    // Fall back to parent product images when variation has no images
    return images;
  }, [variationImages, images]);

  // Memoize the handler to prevent unnecessary re-renders
  const handleVariationChange = useCallback((variation: ProductVariation | null) => {
    let newImages: ProductImage[] | null = null;

    // If variation has images, use them (backend already checks same-color variations)
    if (variation?.images && variation.images.length > 0) {
      newImages = variation.images;
    } else {
      // Fall back to parent product images if variation has no images
      // (including when other variations with same color also have no images)
      newImages = null; // null signals to use parent images
    }

    // Only update state if images actually changed
    // Use functional update to access current state
    setVariationImages((currentVariationImages) => {
      const currentImages = currentVariationImages || images;

      if (newImages === null) {
        // If resetting to base images, only update if we're currently showing variation images
        return currentVariationImages !== null ? null : currentVariationImages;
      }

      // Only update if images are different
      if (!areImagesEqual(newImages, currentImages)) {
        return newImages;
      }

      // Images are the same, return current state to prevent re-render
      return currentVariationImages;
    });

    // Update current SKU for header
    setCurrentVariationSku(variation?.sku || product?.sku);

    // Update current price for mobile header
    const currency = normalizeCurrency(product.currency || '₽');
    const displayPrice = variation
      ? (variation.on_sale && variation.sale_price ? variation.sale_price : variation.price)
      : (product.on_sale && product.sale_price ? product.sale_price : product.price);

    setCurrentPrice(formatPrice(displayPrice, currency));
    setCurrentOnSale(variation ? !!variation.on_sale : !!product.on_sale);
  }, [images, product]);

  return (
    <Section noPadding className={styles.productView}>
      <div className={styles.mobileHeader}>
        <ProductHeader name={name} sku={currentVariationSku} variant="mobile" />
        <ProductImageGallery
          images={displayImages}
          productName={name}
        />
        <ProductPrice price={currentPrice} onSale={currentOnSale} variant="mobile" />
      </div>
      <ProductInfo
        product={product}
        initialVariationSlug={initialVariationSlug}
        onVariationChange={handleVariationChange}
      />
    </Section>
  );
};
