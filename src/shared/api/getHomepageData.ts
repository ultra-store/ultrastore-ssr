import { parseDataFromFetchResponse } from '@/shared/utils/parse-data-from-fetch-response';

import wpApiClient from './client';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export const getHomepageData = async () => {
  const response = await wpApiClient.GET('/ultra/v1/home');

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};

// Cache revalidation function
export const revalidateHomepageData = async () => {
  'use server';

  // This would trigger revalidation of homepage data
  // Note: This is a placeholder - you'd need to implement based on your backend
  console.log('Homepage data cache revalidation triggered');
};
