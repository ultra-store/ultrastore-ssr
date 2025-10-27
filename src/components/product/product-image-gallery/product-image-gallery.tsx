'use client';
import { useState } from 'react';

import Image from 'next/image';

import type { ProductImage } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './product-image-gallery.module.css';

export interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export const ProductImageGallery = ({
  images,
  productName,
  className,
}: WithClassName<ProductImageGalleryProps>) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={`${styles.gallery} ${className || ''}`}>
        <div className={styles.mainImage}>
          <Image
            src="/placeholder-product.png"
            alt={productName}
            width={600}
            height={600}
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
          src={images[selectedIndex]?.url || images[0].url}
          alt={images[selectedIndex]?.alt || productName}
          width={600}
          height={600}
          className={styles.image}
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`${styles.thumbnail} ${index === selectedIndex ? styles.thumbnailActive : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Посмотреть изображение ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} - вид ${index + 1}`}
                width={100}
                height={100}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
