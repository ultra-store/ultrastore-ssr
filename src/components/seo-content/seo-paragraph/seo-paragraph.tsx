import type { SeoContentBlock } from '@/shared/types/types';
import { applyTypograf } from '@/shared/utils/typograf';

import styles from './seo-paragraph.module.css';

interface SeoParagraphProps { block: SeoContentBlock }

export const SeoParagraph = ({ block }: SeoParagraphProps) => {
  const { paragraphs } = block;

  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={styles.paragraph}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{applyTypograf(paragraph)}</p>
      ))}
    </div>
  );
};
