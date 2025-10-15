import type { FetchResponse } from 'openapi-fetch';
import type { MediaType } from 'openapi-typescript-helpers';

import { isEmptyObject } from './is-empty-object';

export const parseDataFromFetchResponse = <
  T extends Record<string | number, unknown>,
  Options = unknown,
  Media extends MediaType = MediaType,
>(
  fetchResponse: FetchResponse<T, Options, Media>,
): NonNullable<FetchResponse<T, Options, Media>['data']> => {
  if (fetchResponse.error || !fetchResponse.response.ok) {
    throw new Error('Failed to fetch data');
  }

  if (!fetchResponse.data || isEmptyObject(fetchResponse.data)) {
    throw new Error('Empty data');
  }

  return fetchResponse.data;
};
