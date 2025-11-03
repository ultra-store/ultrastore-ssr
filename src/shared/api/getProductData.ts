import type { ProductDetails } from '@/shared/types';

import wpApiClient from './client';
import { parseDataFromFetchResponse } from '../utils/parse-data-from-fetch-response';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export const getProductData = async (productSlug: string, variationSlug?: string): Promise<ProductDetails> => {
  // New API format: /ultra/v1/catalog/product/{slug}/{variation-slug}
  // If variationSlug is provided, use the extended path format
  if (variationSlug) {
    // Use direct fetch for the new path format since it's not in the generated types
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.space'}/wp-json`;
    const url = `${baseUrl}/ultra/v1/catalog/product/${productSlug}/${variationSlug}`;
    const response = await fetch(url, { next: { revalidate: 60 } });

    if (!response.ok) {
      // If variation not found, fall back to parent product
      if (response.status === 404) {
        const parentResponse = await wpApiClient.GET('/ultra/v1/catalog/product/{slug}/?', { params: { path: { slug: productSlug } } });

        return returnOrThrowWhenEmpty(parseDataFromFetchResponse(parentResponse));
      }

      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();

    return returnOrThrowWhenEmpty(data);
  }

  // Use standard API client for parent product
  const response = await wpApiClient.GET('/ultra/v1/catalog/product/{slug}/?', { params: { path: { slug: productSlug } } });

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};
