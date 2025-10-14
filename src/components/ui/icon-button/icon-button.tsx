import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';

import styles from './icon-button.module.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string | StaticImageData | ReactNode
  alt?: string
  badge?: number | string
  variant?: 'default' | 'ghost'
  as?: 'button' | 'span'
}

export const IconButton = ({
  icon,
  alt = 'Icon',
  badge,
  variant = 'default',
  className = '',
  as = 'button',
  children,
  ...props
}: IconButtonProps) => {
  const isImageSource = typeof icon === 'string' || (icon && typeof icon === 'object' && 'src' in icon);

  const Component = as;

  const buttonProps = as === 'button' ? props : {};

  return (
    <Component className={`${styles.iconButton} ${className}`} data-variant={variant} {...buttonProps}>
      {isImageSource
        ? (
            <Image src={icon as string | StaticImageData} alt={alt} width={24} height={24} />
          )
        : (
            (icon as React.ReactNode)
          )}
      {badge !== undefined && badge !== null && badge !== 0 && (
        <span className={styles.badge}>{typeof badge === 'number' && badge > 99 ? '99+' : badge}</span>
      )}
      {variant !== 'ghost' && children && <span className={styles.children}>{children}</span>}
    </Component>
  );
};
