import type { ReactNode } from 'react';

import type { WithClassName } from '@/shared/types/utils';

import styles from './section.module.css';

export interface SectionProps {
  title?: string
  children: ReactNode
  ariaLabel?: string
  id?: string
  noPadding?: boolean
  titleAction?: ReactNode
}

export const Section = ({
  title,
  children,
  ariaLabel,
  id,
  className,
  noPadding,
  titleAction,
}: WithClassName<SectionProps>) => {
  return (
    <section
      className={`section ${styles.section}`.trim()}
      aria-label={ariaLabel || title}
      id={id}
    >
      {(title || titleAction) && (
        <div className={`${styles.titleRow} ${noPadding ? styles.noPadding : ''}`}>
          {title && (
            <h2 className={`heading-1 ${styles.title}`}>
              {title}
            </h2>
          )}
          {titleAction && (
            <div className={styles.titleAction}>
              {titleAction}
            </div>
          )}
        </div>
      )}
      <div className={`${styles.content} ${noPadding ? styles.noPadding : ''} ${className || ''}`}>
        {children}
      </div>
    </section>
  );
};
