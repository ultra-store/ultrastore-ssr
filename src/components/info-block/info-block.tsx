import type { CSSProperties } from 'react';

import Image from 'next/image';

import Link from 'next/link';

import type { InfoBlock as InfoBlockType } from '@/shared/types';

import styles from './info-block.module.css';

export const InfoBlock = ({
  title,
  description,
  image,
  image_alt,
  mobile_image,
  mobile_image_alt,
  bg_color,
  link,
}: InfoBlockType) => {
  if (!title || !description) {
    return null;
  }

  return (
    <section
      className={styles.infoBlock}
      style={{ '--bg-color': bg_color || 'var(--surface-interactive)' } as CSSProperties}
      aria-label={title}
    >
      <Link href={link || ''} target="_blank" rel="noopener noreferrer" className={styles.infoBlockLink}>
        <div className={styles.infoBlockContent}>
          <p className={`${styles.infoBlockDescription} heading-1-regular`}>{description}</p>
        </div>
        <div className={styles.infoBlockImage}>
          <Image
            className={styles.infoBlockImageDesktop}
            src={image || ''}
            alt={image_alt || ''}
            width={500}
            height={500}
          />
          <Image
            className={styles.infoBlockImageMobile}
            src={mobile_image || image || ''}
            alt={mobile_image_alt || image_alt || ''}
            width={500}
            height={500}
          />
        </div>
      </Link>
    </section>
  );
};
