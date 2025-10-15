import { parseDataFromFetchResponse } from '@/shared/utils/parse-data-from-fetch-response';

import wpApiClient from './client';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export const getLayoutData = async (slug: string) => {
  const response = await wpApiClient.GET('/ultra/v1/layout/{slug}', { params: { path: { slug } } });

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};
