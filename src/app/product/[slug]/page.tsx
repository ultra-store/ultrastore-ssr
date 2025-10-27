import { ProductInfo, ProductImageGallery, ProductDescription, RelatedProducts } from '@/components/product';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import type { BreadcrumbItem } from '@/components/ui/breadcrumbs/breadcrumbs';

import { getProductData } from '@/shared/api/getProductData';

import styles from './page.module.css';

interface ProductPageProps { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductData(slug);

  const categoryItem = product.categories.length > 0
    ? {
        label: product.categories[0].name,
        href: `/${product.categories[0].slug}`,
      }
    : undefined;
  const breadcrumbs: BreadcrumbItem[] = [{
    label: 'Главная',
    href: '/',
  }, ...(categoryItem ? [categoryItem] : []), { label: product.name }];

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <Breadcrumbs
          items={breadcrumbs}
          className={styles.breadcrumbs}
        />

        <div className={styles.productLayout}>
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            className={styles.gallery}
          />

          <ProductInfo
            product={product}
            className={styles.info}
          />
        </div>

        <div className={styles.descriptionSection}>
          <ProductDescription
            shortDescription={product.short_description}
            description={product.description}
            attributes={product.attributes}
            sku={product.sku}
            weight={product.weight}
            dimensions={product.dimensions}
          />
        </div>

        {product.related_products.length > 0 && (
          <RelatedProducts products={product.related_products} />
        )}
      </div>
    </div>
  );
}
