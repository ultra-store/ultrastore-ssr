import type { ReactNode } from 'react';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';

import styles from './mobile-tabbar.module.css';

interface TabButtonProps {
  icon: string | StaticImageData | ReactNode
  alt?: string
  badge?: number | string
  variant?: 'default' | 'ghost'
  children?: ReactNode
  className?: string
  isActive?: boolean
}

export const TabButton = ({
  icon,
  alt = 'Icon',
  badge,
  children,
  className = '',
  isActive = false,
}: TabButtonProps) => {
  const isImageSource = typeof icon === 'string' || (icon && typeof icon === 'object' && 'src' in icon);

  const iconSrc = isImageSource ? (icon as StaticImageData).src : '';

  return (
    <span className={`${styles.tabButton} ${isActive ? styles.active : ''} ${className}`}>
      {isImageSource
        ? (
            <span
              className={styles.iconWrapper}
              style={{ '--icon-src': `url(${iconSrc})` } as React.CSSProperties}
            >
              <Image src={icon as string | StaticImageData} alt={alt} width={24} height={24} />
            </span>
          )
        : (
            (icon as React.ReactNode)
          )}
      {badge !== undefined && badge !== null && badge !== 0 && (
        <span className={styles.badge}>{typeof badge === 'number' && badge > 99 ? '99+' : badge}</span>
      )}
      {children && <span className={styles.tabLabel}>{children}</span>}
    </span>
  );
};
