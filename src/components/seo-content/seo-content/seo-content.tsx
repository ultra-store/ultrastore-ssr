import type { SeoContentBlock } from '@/shared/types/types';
import { applyTypograf } from '@/shared/utils/typograf';

import { SeoContentBlockComponent } from '../seo-content-block/seo-content-block';

import styles from './seo-content.module.css';

interface SeoContentProps {
  blocks?: SeoContentBlock[]
  title?: string
  className?: string
}

export const SeoContent = ({ blocks, title, className }: SeoContentProps) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Find the first heading index and check if there's a paragraph before it
  const firstHeadingIndex = blocks.findIndex((block) => block.type === 'heading');
  const hasParagraphBeforeFirstHeading = firstHeadingIndex > 0
    && blocks.slice(0, firstHeadingIndex).some((block) => block.type === 'paragraph');

  return (
    <div className={`${styles.seoContent} ${className || ''}`}>
      {title && (
        <h2 className={styles.title}>{applyTypograf(title)}</h2>
      )}
      {blocks.map((block, index) => {
        const isFirstHeadingWithoutParagraph
          = block.type === 'heading'
            && index === firstHeadingIndex
            && !hasParagraphBeforeFirstHeading;

        return (
          <SeoContentBlockComponent
            key={block.id || index}
            block={block}
            isFirstHeadingWithoutParagraph={isFirstHeadingWithoutParagraph}
          />
        );
      })}
    </div>
  );
};
