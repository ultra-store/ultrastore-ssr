import type { ElementType } from 'react';

import Image from 'next/image';

import { applyTypografToHTML, applyTypograf } from '@/shared/utils/typograf';

import styles from './page-content.module.css';

interface PageBlock {
  type: string
  blockName?: string
  content?: string
  level?: string
  url?: string
  alt?: string
  id?: number
  caption?: string
  ordered?: boolean
  items?: string[]
  citation?: string
  attrs?: Record<string, unknown>
  blocks?: PageBlock[]
}

interface PageContentProps {
  content: PageBlock[]
  excerpt?: string | null
}

export const PageContent = ({
  content,
  excerpt,
}: PageContentProps) => {
  return (
    <div className={styles.pageContent}>
      {excerpt && (
        <div
          className={styles.excerpt}
          dangerouslySetInnerHTML={{ __html: applyTypografToHTML(excerpt) }}
        />
      )}

      <div className={styles.content}>
        {content.map((block, index) => (
          <PageBlockComponent key={index} block={block} />
        ))}
      </div>
    </div>
  );
};

interface PageBlockComponentProps { block: PageBlock }

const PageBlockComponent = ({ block }: PageBlockComponentProps) => {
  switch (block.type) {
    case 'paragraph':
      if (!block.content) {
        return null;
      }

      return (
        <p
          className={`large text-primary ${styles.blockParagraph}`}
          dangerouslySetInnerHTML={{ __html: applyTypografToHTML(block.content) }}
        />
      );

    case 'heading':
      if (!block.content && !block.level) {
        return null;
      }

      const HeadingTag = (block.level || 'h2') as ElementType;

      // Определяем класс в зависимости от уровня заголовка
      let headingClass = '';
      const level = block.level || 'h2';

      if (level === 'h1') {
        headingClass = 'heading-1';
      } else if (level === 'h2') {
        headingClass = 'heading-2';
      } else if (level === 'h3' || level === 'h4' || level === 'h5' || level === 'h6') {
        // Для h3-h6 используем стили h3 из глобальных стилей
        headingClass = '';
      }

      return (
        <HeadingTag
          className={headingClass ? `${headingClass} text-primary` : 'text-primary'}
          dangerouslySetInnerHTML={{ __html: applyTypografToHTML(block.content || '') }}
        />
      );

    case 'image':
      if (!block.url) {
        return null;
      }

      return (
        <figure className={styles.blockImage}>
          <Image
            src={block.url}
            alt={block.alt || ''}
            width={1200}
            height={800}
            className={styles.image}
            unoptimized
          />
          {block.caption && (
            <figcaption className={styles.imageCaption}>
              {applyTypograf(block.caption)}
            </figcaption>
          )}
        </figure>
      );

    case 'list':
      if (!block.items || block.items.length === 0) {
        return null;
      }

      const ListTag = block.ordered ? 'ol' : 'ul';

      return (
        <ListTag
          className={styles.blockList}
          data-ordered={block.ordered ? 'true' : 'false'}
        >
          {block.items.map((item, index) => (
            <li
              key={index}
              className={styles.listItem}
              dangerouslySetInnerHTML={{ __html: applyTypografToHTML(item) }}
            />
          ))}
        </ListTag>
      );

    case 'quote':
      if (!block.content) {
        return null;
      }

      return (
        <blockquote className={styles.blockQuote}>
          <p
            className="large text-primary"
            dangerouslySetInnerHTML={{ __html: applyTypografToHTML(block.content) }}
          />
          {block.citation && (
            <cite className={styles.quoteCitation}>
              {applyTypograf(block.citation)}
            </cite>
          )}
        </blockquote>
      );

    case 'columns':
    case 'group':
    case 'cover':
    case 'media-text':
      if (block.blocks && block.blocks.length > 0) {
        return (
          <div className={styles.blockContainer}>
            {block.blocks.map((nestedBlock, index) => (
              <PageBlockComponent key={index} block={nestedBlock} />
            ))}
          </div>
        );
      }

      if (block.content) {
        return (
          <div
            className={styles.blockHtml}
            dangerouslySetInnerHTML={{ __html: applyTypografToHTML(block.content) }}
          />
        );
      }

      return null;

    case 'html':
    default:
      if (block.content) {
        return (
          <div
            className={styles.blockHtml}
            dangerouslySetInnerHTML={{ __html: applyTypografToHTML(block.content) }}
          />
        );
      }

      return null;
  }
};
