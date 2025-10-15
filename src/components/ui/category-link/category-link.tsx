import type { AnchorHTMLAttributes } from 'react';

import Link from 'next/link';

import type { WithClassName } from '@/shared/types/utils';

import styles from './category-link.module.css';

export type CategoryLinkProps = {
  href: string
  text: string
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const CategoryLink = ({
  href,
  text,
  className,
  ...props
}: WithClassName<CategoryLinkProps>) => {
  return (
    <Link
      href={href}
      className={`${styles.categoryLink} ${className || ''}`}
      {...props}
    >
      {text}
    </Link>
  );
};
