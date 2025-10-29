import { CategoryContent } from '@/components/category/category-content';
import { ProductTags } from '@/components/product-tags';
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

  const [categoryData, layoutData] = await Promise.all([
    getCategoryData(categorySlug, search),
    getLayoutData(categorySlug),
  ]);

  const tags = categoriesToTags(categoryData.category?.children || []);

  return (
    <Section title={categoryData.category?.name} ariaLabel={categoryData.category?.name} className="category-page">
      <ProductTags tags={tags} />
      <CategoryContent
        categoryData={categoryData}
        contacts={layoutData.contacts}
        social={layoutData.social}
      />
    </Section>
  );
}
