'use client';

import type { CSSProperties } from 'react';

import Image from 'next/image';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CompactLogo from '@/shared/images/compact-logo.svg';
import FullLogo from '@/shared/images/full-logo.svg';
import type { WithClassName } from '@/shared/types/utils';

import styles from './logo.module.css';

interface LogoProps extends Pick<LinkProps, 'href'> {
  title?: string
  className?: string
  full?: boolean
  onClick?: React.MouseEventHandler
  width?: number | string
  height?: number | string
}

export const Logo = ({ href, title, full, onClick, className, width, height }: WithClassName<LogoProps>) => {
  const pathname = usePathname();

  const linkStyle: CSSProperties & Record<string, string> = {};

  if (width) {
    linkStyle['--logo-width'] = typeof width === 'number' ? `${width}px` : width;
  }

  if (height) {
    linkStyle['--logo-height'] = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <Link
      href={href}
      className={`${styles.link} ${className || ''}`}
      title={title}
      aria-disabled={pathname === '/'}
      onClick={onClick}
      style={linkStyle}
    >
      {full
        ? (
            <Image src={FullLogo} alt="Full Logo" className={styles.image} />
          )
        : (
            <Image src={CompactLogo} alt="Compact Logo" className={styles.image} />
          )}
    </Link>
  );
};
