import { notFound } from 'next/navigation';

import { ProductInfo, ProductImageGallery, ProductDescription, RelatedProducts, SimilarProducts } from '@/components/product';
import { SeoContent } from '@/components/seo-content/seo-content';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import type { BreadcrumbItem } from '@/components/ui/breadcrumbs/breadcrumbs';

import { getProductData } from '@/shared/api/getProductData';

import styles from './page.module.css';

interface ProductPageProps { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;

  try {
    product = await getProductData(slug);
  } catch {
    notFound();
  }

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
            attributes={product.attributes}
            variations={product.variations}
            sku={product.sku}
            weight={product.weight}
            dimensions={product.dimensions}
            reviews={product.reviews}
          />
        </div>

        {product.related_products.length > 0 && (
          <RelatedProducts products={product.related_products} />
        )}

        {product.similar_products.length > 0 && (
          <SimilarProducts products={product.similar_products} />
        )}

        {Array.isArray(product.description) && product.description.length > 0 && (
          <SeoContent blocks={product.description} title={product.description_title} />
        )}

        {product.seo_blocks && product.seo_blocks.length > 0 && (
          <SeoContent blocks={product.seo_blocks} />
        )}
      </div>
    </div>
  );
}
