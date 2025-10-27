import { CategoryContent } from '@/components/category/category-content';
import { ProductTags } from '@/components/product-tags';
import { Section } from '@/components/ui/section';
import { getCategoryData } from '@/shared/api/getCategoryData';
import { getLayoutData } from '@/shared/api/getLayoutData';
import type { CategorySearchParams } from '@/shared/types/types';

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<CategorySearchParams>
}

const tags = [
  {
    name: 'iPhone 16 Pro Max',
    href: '/iphone-16-pro-max',
  },
  {
    name: 'iPhone 16 Pro',
    href: '/iphone-16-pro',
  },
  {
    name: 'iPhone 16 Plus',
    href: '/iphone-16-plus',
  },
  {
    name: 'iPhone 16e',
    href: '/iphone-16e',
  },
  {
    name: 'iPhone 16',
    href: '/iphone-16',
  },
  {
    name: 'iPhone 15 Pro Max',
    href: '/iphone-15-pro-max',
  },
  {
    name: 'iPhone 15 Pro',
    href: '/iphone-15-pro',
  },
  {
    name: 'iPhone 15 Plus',
    href: '/iphone-15-plus',
  },
  {
    name: 'iPhone 14',
    href: '/iphone-14',
  },
];

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const search = await searchParams;

  const categoryData = await getCategoryData(category, search);
  const { contacts, social } = await getLayoutData('front-page');

  return (
    <Section title={categoryData.category.name} ariaLabel={categoryData.category.name} className="category-page">
      <ProductTags tags={tags} />
      <CategoryContent
        products={categoryData.products}
        sorting={categoryData.sorting}
        contacts={contacts}
        social={social}
        seoBlocks={categoryData.category.seo_blocks}
      />
    </Section>
  );
}
