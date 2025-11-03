import { notFound } from 'next/navigation';

import { ProductDescription, RelatedProducts, SimilarProducts, ProductView } from '@/components/product';
import { SeoContent } from '@/components/seo-content/seo-content';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import type { BreadcrumbItem } from '@/components/ui/breadcrumbs/breadcrumbs';

import { Section } from '@/components/ui/section';
import { getProductData } from '@/shared/api/getProductData';

interface CategoryProductVariationPageProps {
  params: Promise<{
    category: string
    product: string
    variation: string
  }>
}

export default async function CategoryProductVariationPage({ params }: CategoryProductVariationPageProps) {
  const { product, variation } = await params;

  let productData;

  try {
    productData = await getProductData(product, variation);
  } catch {
    notFound();
  }

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
      />

      <ProductView
        images={productData.images}
        name={productData.name}
        product={productData}
        initialVariationSlug={variation}
      />

      <div>
        <ProductDescription
          shortDescription={productData.short_description}
          attributes={productData.attributes}
          variations={productData.variations}
          sku={productData.sku}
          weight={productData.weight}
          dimensions={productData.dimensions}
          reviews={productData.reviews}
        />
      </div>

      {productData.related_products.length > 0 && (
        <RelatedProducts products={productData.related_products} />
      )}

      {productData.similar_products.length > 0 && (
        <SimilarProducts products={productData.similar_products} />
      )}

      {Array.isArray(productData.description) && productData.description.length > 0 && (
        <SeoContent blocks={productData.description} title={productData.description_title} />
      )}

      {productData.seo_blocks && productData.seo_blocks.length > 0 && (
        <SeoContent blocks={productData.seo_blocks} />
      )}
    </Section>
  );
}
