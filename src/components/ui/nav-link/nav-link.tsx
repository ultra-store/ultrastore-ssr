import Image from 'next/image';
import Link from 'next/link';

import type { WithClassName } from '@/shared/types/utils';

import styles from './nav-link.module.css';

export type NavLinkProps = {
  href: string
  text: string
  icon?: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const NavLink = ({
  href,
  text,
  icon,
  className,
  ...props
}: WithClassName<NavLinkProps>) => {
  return (
    <Link
      href={href}
      className={`${styles.navLink} ${className || ''}`}
      {...props}
    >
      <span className={styles.text}>{text}</span>
      {icon && <Image src={icon} alt="" width={15} height={15} className={styles.icon} />}
    </Link>
  );
};
