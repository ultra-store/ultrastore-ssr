'use client';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import type { ProductImage } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './product-image-gallery.module.css';

export interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

// Memoized thumbnail button component to prevent unnecessary re-renders
const ThumbnailButton = memo(({
  image,
  index,
  isActive,
  productName,
  onClick,
}: {
  image: ProductImage
  index: number
  isActive: boolean
  productName: string
  onClick: () => void
}) => (
  <button
    type="button"
    className={`${styles.thumbnail} ${isActive ? styles.thumbnailActive : ''}`}
    onClick={onClick}
    aria-label={`Посмотреть изображение ${index + 1}`}
  >
    <Image
      src={image.url}
      alt={image.alt || `${productName} - вид ${index + 1}`}
      width={100}
      height={100}
      className={styles.thumbnailImage}
      loading="lazy"
    />
  </button>
));

ThumbnailButton.displayName = 'ThumbnailButton';

// Helper function to compare image arrays by content
const areImagesEqual = (images1: ProductImage[], images2: ProductImage[]): boolean => {
  if (images1.length !== images2.length) {
    return false;
  }

  return images1.every((img1, index) => {
    const img2 = images2[index];

    return img1.url === img2.url && img1.id === img2.id;
  });
};

export const ProductImageGallery = ({
  images,
  productName,
  className,
}: WithClassName<ProductImageGalleryProps>) => {
  const [selectedIndexState, setSelectedIndexState] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const prevImagesKeyRef = useRef<string>('');
  const stableImagesRef = useRef<ProductImage[]>(images);

  // Create a stable key from image URLs to detect real changes
  const imagesKey = useMemo(() => {
    return images.map((img) => `${img.id || ''}-${img.url}`).join('|');
  }, [images]);

  // Store stable reference to images array to prevent unnecessary re-renders
  // Update stable images when images actually change
  // This prevents showing wrong active thumbnail when navigating from parent to variation
  const [stableImages, setStableImages] = useState<ProductImage[]>(images);

  // Update stable images and reset selectedIndex when images actually change
  // Using queueMicrotask to schedule state updates asynchronously and avoid cascading renders
  useEffect(() => {
    const imagesChanged = imagesKey !== prevImagesKeyRef.current;

    if (imagesChanged) {
      // Check if images content actually changed
      const imagesContentChanged = !areImagesEqual(images, stableImagesRef.current);

      if (imagesContentChanged) {
        stableImagesRef.current = images;
        prevImagesKeyRef.current = imagesKey;

        // Schedule state updates asynchronously to avoid cascading renders
        queueMicrotask(() => {
          setStableImages(images);
          setSelectedIndexState(0);
        });
      } else {
        prevImagesKeyRef.current = imagesKey;
      }
    }
  }, [imagesKey, images]);

  // Derive valid selectedIndex that's always in bounds (clamp to valid range)
  // This prevents errors when images change and ensures we never show invalid index
  const selectedIndex = useMemo(() => {
    if (stableImages.length === 0) {
      return 0;
    }

    // Clamp to valid range - ensure we never access out of bounds
    return Math.min(selectedIndexState, Math.max(0, stableImages.length - 1));
  }, [stableImages.length, selectedIndexState]);

  const checkScrollPosition = () => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      const isEnd = scrollLeft + clientWidth >= scrollWidth - 1;
      const needsScroll = scrollWidth > clientWidth;

      setIsAtEnd(isEnd || !needsScroll);
    }
  };

  // Memoize the current image to prevent unnecessary re-renders (must be before early return)
  const currentImage = useMemo(() => {
    if (stableImages.length === 0) {
      return null;
    }

    return stableImages[selectedIndex] || stableImages[0];
  }, [stableImages, selectedIndex]);

  // Create stable click handler using useCallback
  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndexState(index);
  }, []);

  // Memoize thumbnails list using stable images reference
  // This prevents re-rendering when images array reference changes but content is the same
  // Stable keys based on image ID/URL ensure React doesn't re-mount components
  const thumbnailsList = useMemo(() => {
    if (stableImages.length <= 1) {
      return null;
    }

    return stableImages.map((image, index) => {
      // Use stable key based on image ID or URL to prevent re-mounting
      // Never use index as part of key to maintain stability
      const imageKey = image.id ? `img-${image.id}` : `img-${image.url}`;

      return {
        image,
        index,
        key: imageKey,
        onClick: () => handleThumbnailClick(index),
      };
    });
  }, [stableImages, handleThumbnailClick]);

  useEffect(() => {
    const thumbnails = thumbnailsRef.current;

    if (thumbnails) {
      // Проверяем позицию после рендеринга
      requestAnimationFrame(() => {
        checkScrollPosition();
      });

      thumbnails.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);

      return () => {
        thumbnails.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
    // Only re-run when images actually change (different content), not when reference changes
  }, [imagesKey]);

  if (stableImages.length === 0) {
    return (
      <div className={`${styles.gallery} ${className || ''}`}>
        <div className={styles.mainImage}>
          <Image
            src="/placeholder-product.png"
            alt={productName}
            width={450}
            height={450}
            className={styles.image}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.gallery} ${className || ''}`}>
      <div className={styles.mainImage}>
        <Image
          key={currentImage?.url}
          src={currentImage?.url || stableImages[0].url}
          alt={currentImage?.alt || productName}
          width={450}
          height={450}
          className={styles.image}
          priority={selectedIndex === 0}
        />
      </div>

      {thumbnailsList && (
        <div className={`${styles.thumbnailsWrapper} ${isAtEnd ? styles.thumbnailsWrapperAtEnd : ''}`}>
          <div
            ref={thumbnailsRef}
            className={styles.thumbnails}
          >
            {thumbnailsList.map(({ image, index, key: imageKey, onClick }) => (
              <ThumbnailButton
                key={imageKey}
                image={image}
                index={index}
                isActive={index === selectedIndex}
                productName={productName}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
