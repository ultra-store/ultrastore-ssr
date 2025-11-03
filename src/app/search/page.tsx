import { notFound } from 'next/navigation';

import { SearchContent } from '@/components/search/search-content/search-content';
import { Section } from '@/components/ui/section';
import { getLayoutData } from '@/shared/api/getLayoutData';
import { getSearchData } from '@/shared/api/getSearchData';
import type { SearchSearchParams } from '@/shared/types';

interface SearchPageProps { searchParams: Promise<SearchSearchParams> }

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams;

  if (!search.q || !search.q.trim()) {
    return (
      <Section title="Поиск" ariaLabel="Поиск" className="search-page">
        <p>Введите поисковый запрос</p>
      </Section>
    );
  }

  let searchData;
  let layoutData;

  try {
    [searchData, layoutData] = await Promise.all([
      getSearchData(search),
      getLayoutData('search'),
    ]);
  } catch {
    notFound();
  }

  return (
    <Section
      title={`Результаты поиска: "${searchData.query}"`}
      ariaLabel={`Результаты поиска: ${searchData.query}`}
      className="search-page"
    >
      <SearchContent
        searchData={searchData}
        initialSearch={search}
        contacts={layoutData.contacts}
        social={layoutData.social}
      />
    </Section>
  );
}
