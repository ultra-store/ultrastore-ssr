import type { SearchData, SearchSearchParams } from '@/shared/types';

import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

interface Options { signal?: AbortSignal }

export const getSearchData = async (
  searchParams: SearchSearchParams,
  options: Options = {},
): Promise<SearchData> => {
  if (!searchParams.q || !searchParams.q.trim()) {
    throw new Error('Search query is required');
  }

  // Use direct fetch since the search endpoint might not be in the generated types yet
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.space'}/wp-json`;
  const url = new URL(`${baseUrl}/ultra/v1/search`);

  // Add query parameters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }

  const data = await response.json();

  return returnOrThrowWhenEmpty(data);
};
