import Link from 'next/link';

import type { ProductTag as ProductTagType } from '@/shared/types/types';

import styles from './product-tag.module.css';

interface ProductTagProps { tag: ProductTagType }

export const ProductTag = ({ tag }: ProductTagProps) => {
  const { name, href } = tag;

  return (
    <div className={styles.productTag}>
      <Link href={href} className="medium">
        {name}
      </Link>
    </div>
  );
};
