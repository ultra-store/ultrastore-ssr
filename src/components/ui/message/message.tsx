import type { WithClassName } from '@/shared/types/utils';

import styles from './message.module.css';

export interface MessageProps {
  title: string
  description: string
}

export const Message = ({ title, description, className }: WithClassName<MessageProps>) => {
  return (
    <div className={`${styles.message} ${className || ''}`}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
