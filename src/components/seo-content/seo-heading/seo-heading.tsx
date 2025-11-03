import type { JSX } from 'react';

import type { SeoContentBlock } from '@/shared/types/types';
import { applyTypografToHTML } from '@/shared/utils/typograf';

import styles from './seo-heading.module.css';

interface SeoHeadingProps {
  block: SeoContentBlock
  isFirstWithoutParagraph?: boolean
}

export const SeoHeading = ({ block, isFirstWithoutParagraph }: SeoHeadingProps) => {
  const { text, level = 'h2' } = block;

  if (!text) {
    return null;
  }

  const HeadingTag = level as keyof JSX.IntrinsicElements || 'h2';

  // Apply heading class based on level
  const headingClass = level === 'h2'
    ? styles.heading1
    : styles.heading2;

  // Apply class for first heading without paragraph before it
  const firstWithoutParagraphClass = isFirstWithoutParagraph ? styles.firstWithoutParagraph : '';

  // Apply typographer to HTML text
  const typografText = applyTypografToHTML(text);

  return (
    <HeadingTag
      className={`${styles.heading} ${headingClass} ${firstWithoutParagraphClass}`}
      dangerouslySetInnerHTML={{ __html: typografText }}
    />
  );
};
