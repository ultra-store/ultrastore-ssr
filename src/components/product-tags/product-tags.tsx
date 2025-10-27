import { ProductTag } from '@/components/ui/product-tag';
import type { ProductTag as ProductTagType } from '@/shared/types/types';

import styles from './product-tags.module.css';

interface ProductTagsProps { tags: ProductTagType[] }

export const ProductTags = ({ tags }: ProductTagsProps) => {
  return (
    <div className={styles.productTags}>
      {tags.map((tag) => (
        <ProductTag key={tag.name} tag={tag} />
      ))}
    </div>
  );
};
