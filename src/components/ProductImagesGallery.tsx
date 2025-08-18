'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardBody } from '@heroui/react';
import { WooCommerceImage } from '@/types/woocommerce';

type ProductImagesGalleryProps = {
  images: WooCommerceImage[];
  name: string;
};

export default function ProductImagesGallery({ images, name }: ProductImagesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const hasImages = images && images.length > 0;

  const mainSrc = useMemo(() => {
    if (!hasImages) return '/placeholder-product.png';
    if (failedIndices.has(selectedIndex)) return '/placeholder-product.png';
    return images[selectedIndex]?.src || '/placeholder-product.png';
  }, [hasImages, images, selectedIndex, failedIndices]);

  const handleMainError = () => {
    setFailedIndices(prev => new Set(prev).add(selectedIndex));
  };

  // Show up to 4 additional thumbnails like the original layout (indices 1..4)
  const thumbnailItems = useMemo(() => {
    if (!hasImages) return [] as { src: string; index: number }[];
    return images
      .map((img, idx) => ({ src: img.src, index: idx }))
      .slice(1, 5);
  }, [images, hasImages]);

  return (
    <div>
      <Card shadow="sm" className="mb-4">
        <CardBody className="p-0">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={mainSrc}
              alt={name}
              width={800}
              height={800}
              className="h-full w-full object-cover object-center"
              onError={handleMainError}
              priority
            />
          </div>
        </CardBody>
      </Card>

      {thumbnailItems.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbnailItems.map(({ src, index }) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`aspect-square overflow-hidden rounded bg-gray-200 ring-2 transition-colors ${
                  isActive ? 'ring-primary' : 'ring-transparent hover:ring-gray-300'
                }`}
              >
                <Image
                  src={failedIndices.has(index) ? '/placeholder-product.png' : src}
                  alt={`${name} - изображение ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover object-center"
                  onError={() => setFailedIndices(prev => new Set(prev).add(index))}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


