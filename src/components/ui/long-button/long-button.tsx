import Link from 'next/link';

import styles from './long-button.module.css';

export interface LongButtonProps {
  href?: string
  children: React.ReactNode
  asButton?: boolean
}

export const LongButton = ({ href = '#', children, asButton = false }: LongButtonProps) => {
  if (asButton) {
    return (
      <button type="button" className={styles.button}>
        <span className={styles.text}>{children}</span>
      </button>
    );
  }

  return (
    <Link href={href} className={styles.button}>
      <span className={styles.text}>{children}</span>
    </Link>
  );
};
