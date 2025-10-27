import { ProductInfo, ProductImageGallery, ProductDescription, RelatedProducts } from '@/components/product';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import type { BreadcrumbItem } from '@/components/ui/breadcrumbs/breadcrumbs';

import { Section } from '@/components/ui/section';
import { getProductData } from '@/shared/api/getProductData';

import styles from './page.module.css';

interface CategoryProductPageProps {
  params: Promise<{
    category: string
    product: string
  }>
}

export default async function CategoryProductPage({ params }: CategoryProductPageProps) {
  const { product } = await params;
  const productData = await getProductData(product);

  const categoryItem = productData.categories.length > 0
    ? {
        label: productData.categories[0].name,
        href: `/${productData.categories[0].slug}`,
      }
    : undefined;
  const breadcrumbs: BreadcrumbItem[] = [...(categoryItem ? [categoryItem] : []), { label: productData.name }];

  return (
    <Section>
      <Breadcrumbs
        items={breadcrumbs}
        className={styles.breadcrumbs}
      />

      <div className={styles.productLayout}>
        <ProductImageGallery
          images={productData.images}
          productName={productData.name}
          className={styles.gallery}
        />

        <ProductInfo
          product={productData}
          className={styles.info}
        />
      </div>

      <div className={styles.descriptionSection}>
        <ProductDescription
          shortDescription={productData.short_description}
          description={productData.description}
          attributes={productData.attributes}
          sku={productData.sku}
          weight={productData.weight}
          dimensions={productData.dimensions}
        />
      </div>

      {productData.related_products.length > 0 && (
        <RelatedProducts products={productData.related_products} />
      )}
    </Section>
  );
}
