import type { CategoryData, CategorySearchParams } from '@/shared/types';

import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

interface Options { signal?: AbortSignal }

export async function getCompilationData(
  type: 'new' | 'sale',
  search: CategorySearchParams,
  options: Options = {},
): Promise<CategoryData> {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.space'}/wp-json`;
  const url = new URL(`${baseUrl}/ultra/v1/catalog/compilation/${type}`);

  Object.entries(search || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch compilation: ${response.statusText}`);
  }

  const data = await response.json();

  return returnOrThrowWhenEmpty(data);
}
