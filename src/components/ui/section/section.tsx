import type { ReactNode } from 'react';

import type { WithClassName } from '@/shared/types/utils';

import styles from './section.module.css';

export interface SectionProps {
  title?: string
  children: ReactNode
  ariaLabel?: string
  id?: string
  noPadding?: boolean
}

export const Section = ({
  title,
  children,
  ariaLabel,
  id,
  className,
  noPadding,
}: WithClassName<SectionProps>) => {
  return (
    <section
      className={`section ${styles.section}`.trim()}
      aria-label={ariaLabel || title}
      id={id}
    >
      {title && (
        <h2 className={`heading-1 ${styles.title} ${noPadding ? styles.noPadding : ''}`}>
          {title}
        </h2>
      )}
      <div className={`${styles.content} ${noPadding ? styles.noPadding : ''} ${className || ''}`}>
        {children}
      </div>
    </section>
  );
};
