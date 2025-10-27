import type { CategorySearchParams, CategoryData } from '@/shared/types';

import wpApiClient from './client';
import { parseDataFromFetchResponse } from '../utils/parse-data-from-fetch-response';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export const getCategoryData = async (slug: string, search: CategorySearchParams): Promise<CategoryData> => {
  const response = await wpApiClient.GET('/ultra/v1/catalog/category/{slug}/?', {
    params: {
      path: { slug },
      query: { ...search },
    },
  });

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};
