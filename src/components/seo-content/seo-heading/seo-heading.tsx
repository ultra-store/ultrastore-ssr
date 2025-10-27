import type { JSX } from 'react';

import type { SeoContentBlock } from '@/shared/types/types';
import { applyTypograf } from '@/shared/utils/typograf';

import styles from './seo-heading.module.css';

interface SeoHeadingProps { block: SeoContentBlock }

export const SeoHeading = ({ block }: SeoHeadingProps) => {
  const { text, level = 'h2' } = block;

  if (!text) {
    return null;
  }

  const HeadingTag = level as keyof JSX.IntrinsicElements || 'h2';

  // Apply heading class based on level
  const headingClass = level === 'h2'
    ? styles.heading1
    : styles.heading2;

  // Apply typographer to text
  const typografText = applyTypograf(text);

  return <HeadingTag className={`${styles.heading} ${headingClass}`}>{typografText}</HeadingTag>;
};
