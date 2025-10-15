import { parseDataFromFetchResponse } from '@/shared/utils/parse-data-from-fetch-response';

import wpApiClient from './client';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export const getHomepageData = async () => {
  const response = await wpApiClient.GET('/ultra/v1/home');

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};
