import type { ReactNode } from 'react';

import styles from './section.module.css';

export interface SectionProps {
  title?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
  id?: string
}

export const Section = ({
  title,
  className,
  children,
  ariaLabel,
  id,
}: SectionProps) => {
  return (
    <section
      className={`section ${styles.section} ${className || ''}`.trim()}
      aria-label={ariaLabel || title}
      id={id}
    >
      {title && (
        <h2 className={`heading-1 ${styles.title}`}>
          {title}
        </h2>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
};
