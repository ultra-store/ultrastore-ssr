import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CategoryContent } from '@/components/category/category-content';
import { PageContent } from '@/components/page/page-content';
import { ProductTags } from '@/components/product-tags';
import { SeoContent } from '@/components/seo-content/seo-content';
import { Section } from '@/components/ui/section';
import { getCategoryData } from '@/shared/api/getCategoryData';
import { getLayoutData } from '@/shared/api/getLayoutData';
import { getPageData } from '@/shared/api/getPageData';
import type { CategorySearchParams } from '@/shared/types';
import { categoriesToTags } from '@/shared/utils/categories-to-tags';

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<CategorySearchParams>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  // Try WordPress page first
  try {
    const pageData = await getPageData(categorySlug);
    const { meta, title } = pageData;

    return {
      title: title || 'Ultrastore',
      description: meta?.description || 'Страница интернет-магазина Ultrastore',
      openGraph: {
        title: title || 'Ultrastore',
        description: meta?.description || 'Страница интернет-магазина Ultrastore',
        type: 'website',
      },
      keywords: meta?.keywords,
    };
  } catch {
    // If not a WordPress page, try category
    try {
      const categoryData = await getCategoryData(categorySlug, {});

      return {
        title: categoryData.category?.name || 'Ultrastore',
        description: categoryData.category?.description || 'Категория товаров',
      };
    } catch {
      return {
        title: 'Ultrastore',
        description: 'Страница интернет-магазина Ultrastore',
      };
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const search = await searchParams;

  // Try WordPress page first
  try {
    const pageData = await getPageData(categorySlug);

    // Layout data is already loaded in root layout, so we don't need it here
    // But we can try to get it for page-specific metadata if needed
    // If it fails, we just continue without it
    try {
      await getLayoutData(categorySlug);
    } catch {
      // Layout data is optional, continue without it
    }

    return (
      <Section title={pageData.title} ariaLabel={pageData.title} className="wordpress-page">
        <PageContent
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content={pageData.content as any}
          excerpt={pageData.excerpt}
        />
      </Section>
    );
  } catch {
    // If not a WordPress page, try category
    try {
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
    } catch {
      notFound();
    }
  }
}
