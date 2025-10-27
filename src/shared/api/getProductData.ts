import type { ProductDetails } from '@/shared/types';

import wpApiClient from './client';
import { parseDataFromFetchResponse } from '../utils/parse-data-from-fetch-response';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export const getProductData = async (slug: string): Promise<ProductDetails> => {
  const response = await wpApiClient.GET('/ultra/v1/catalog/product/{slug}/?', { params: { path: { slug } } });

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};
