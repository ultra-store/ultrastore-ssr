import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';

import type { WithClassName } from '@/shared/types/utils';

import styles from './social-button.module.css';

export type SocialButtonProps = {
  href: string
  icon: string | StaticImageData
  alt: string
  size: number
  variant?: 'default' | 'greyscale'
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const SocialButton = ({ href, icon, alt, size = 20, variant = 'default', ...props }: WithClassName<SocialButtonProps>) => {
  return (
    <Link
      href={href}
      className={styles.socialButton}
      data-variant={variant}
      aria-label={alt}
      {...props}
    >
      <Image src={icon} alt={alt} width={size} height={size} />
    </Link>
  );
};
