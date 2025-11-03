import Image from 'next/image';

import type { SeoContentBlock } from '@/shared/types/types';
import { applyTypograf } from '@/shared/utils/typograf';

interface SeoImageProps { block: SeoContentBlock }

export const SeoImage = ({ block }: SeoImageProps) => {
  const { url, alt = '', caption, width, height } = block;

  if (!url) {
    return null;
  }

  // Apply typographer to caption
  const typografCaption = caption ? applyTypograf(caption) : '';

  // Use actual image dimensions if available, otherwise use defaults
  const imageWidth = width || 1200;
  const imageHeight = height || 800;

  return (
    <figure
      className="seo-image"
      style={width
        ? {
            width: `${width}px`,
            maxWidth: '100%',
          }
        : undefined}
    >
      <Image
        src={url}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        className="seo-image-img"
        unoptimized
      />
      {caption && <figcaption>{typografCaption}</figcaption>}
    </figure>
  );
};
