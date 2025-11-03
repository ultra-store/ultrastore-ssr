import type { SeoContentBlock } from '@/shared/types/types';

import { SeoHeading } from '../seo-heading/seo-heading';
import { SeoImage } from '../seo-image/seo-image';
import { SeoParagraph } from '../seo-paragraph/seo-paragraph';

interface SeoContentBlockComponentProps {
  block: SeoContentBlock
  isFirstHeadingWithoutParagraph?: boolean
}

export const SeoContentBlockComponent = ({ block, isFirstHeadingWithoutParagraph }: SeoContentBlockComponentProps) => {
  switch (block.type) {
    case 'paragraph':
      return <SeoParagraph block={block} />;
    case 'heading':
      return <SeoHeading block={block} isFirstWithoutParagraph={isFirstHeadingWithoutParagraph} />;
    case 'image':
      return <SeoImage block={block} />;
    default:
      return null;
  }
};
