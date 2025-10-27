import Image from 'next/image';
import Link from 'next/link';

import icons from '@/shared/icons';
import type { WithClassName } from '@/shared/types/utils';

import styles from './breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumbs = ({
  items,
  className,
}: WithClassName<BreadcrumbsProps>) => {
  return (
    <nav className={`${styles.breadcrumbs} ${className || ''}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          {index > 0 && (
            <div className={styles.separator}>
              <Image src={icons.chevronRight} alt="" width={17} height={17} />
            </div>
          )}
          {item.href
            ? (
                <Link href={item.href} className={styles.text}>
                  {item.label}
                </Link>
              )
            : (
                <span className={styles.text}>{item.label}</span>
              )}
        </div>
      ))}
    </nav>
  );
};
