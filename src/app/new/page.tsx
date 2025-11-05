import { notFound } from 'next/navigation';

import { CategoryContent } from '@/components/category/category-content';
import { ProductTags } from '@/components/product-tags';
import { SeoContent } from '@/components/seo-content/seo-content';
import { Section } from '@/components/ui/section';

import { getCompilationData } from '@/shared/api/getCompilationData';
import { getLayoutData } from '@/shared/api/getLayoutData';
import type { CategorySearchParams } from '@/shared/types';

interface CompilationPageProps { searchParams: Promise<CategorySearchParams> }

export default async function NewCompilationPage({ searchParams }: CompilationPageProps) {
  const search = await searchParams;

  let compilationData;
  let layoutData;

  try {
    [compilationData, layoutData] = await Promise.all([
      getCompilationData('new', search),
      getLayoutData('new'),
    ]);
  } catch {
    notFound();
  }

  // No tags for compilations
  return (
    <Section title={compilationData.category?.name} ariaLabel={compilationData.category?.name} className="category-page">
      <ProductTags tags={[]} />
      <CategoryContent
        categoryData={compilationData}
        categorySlug="new"
        initialSearch={search}
        contacts={layoutData.contacts}
        social={layoutData.social}
        mode="compilation"
      />
      {compilationData.category?.seo_blocks && compilationData.category.seo_blocks.length > 0 && (
        <SeoContent blocks={compilationData.category.seo_blocks} />
      )}
    </Section>
  );
}
