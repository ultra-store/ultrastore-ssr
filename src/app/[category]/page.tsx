import { notFound } from 'next/navigation';

import { CategoryContent } from '@/components/category/category-content';
import { ProductTags } from '@/components/product-tags';
import { SeoContent } from '@/components/seo-content/seo-content';
import { Section } from '@/components/ui/section';
import { getCategoryData } from '@/shared/api/getCategoryData';
import { getLayoutData } from '@/shared/api/getLayoutData';
import type { CategorySearchParams } from '@/shared/types';
import { categoriesToTags } from '@/shared/utils/categories-to-tags';

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<CategorySearchParams>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const search = await searchParams;

  let categoryData;
  let layoutData;

  try {
    [categoryData, layoutData] = await Promise.all([
      getCategoryData(categorySlug, search),
      getLayoutData(categorySlug),
    ]);
  } catch {
    notFound();
  }

  const tags = categoriesToTags(categoryData.category?.children || []);

  return (
    <Section title={categoryData.category?.name} ariaLabel={categoryData.category?.name} className="category-page">
      <ProductTags tags={tags} />
      <CategoryContent
        categoryData={categoryData}
        categorySlug={categorySlug}
        initialSearch={search}
        contacts={layoutData.contacts}
        social={layoutData.social}
      />
      {categoryData.category?.seo_blocks && categoryData.category.seo_blocks.length > 0 && (
        <SeoContent blocks={categoryData.category.seo_blocks} />
      )}
    </Section>
  );
}
