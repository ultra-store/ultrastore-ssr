import type { AnchorHTMLAttributes } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import type { WithClassName } from '@/shared/types/utils';

import styles from './contact-link.module.css';

export type ContactLinkProps = {
  href: string
  icon: string
  text: string
  bold?: boolean
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const ContactLink = ({
  href,
  icon,
  text,
  bold = false,
  className,
  ...props
}: WithClassName<ContactLinkProps>) => {
  return (
    <Link
      href={href}
      className={`${styles.contactLink} ${className || ''}`}
      {...props}
    >
      <Image src={icon} alt="" width={20} height={20} />
      <span className={bold ? styles.textBold : styles.text}>{text}</span>
    </Link>
  );
};
