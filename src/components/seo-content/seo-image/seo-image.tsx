import Image from 'next/image';

import type { SeoContentBlock } from '@/shared/types/types';
import { applyTypograf } from '@/shared/utils/typograf';

interface SeoImageProps { block: SeoContentBlock }

export const SeoImage = ({ block }: SeoImageProps) => {
  const { url, alt = '', caption } = block;

  if (!url) {
    return null;
  }

  // Apply typographer to caption
  const typografCaption = caption ? applyTypograf(caption) : '';

  return (
    <figure className="seo-image">
      <Image src={url} alt={alt} width={1200} height={800} className="seo-image-img" unoptimized />
      {caption && <figcaption>{typografCaption}</figcaption>}
    </figure>
  );
};
