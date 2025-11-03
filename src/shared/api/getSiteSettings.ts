import wpApiClient from './client';
import { parseDataFromFetchResponse } from '../utils/parse-data-from-fetch-response';
import { returnOrThrowWhenEmpty } from '../utils/return-or-throw';

export interface DateOption {
  value: string
  label: string
  short_label?: string
  day?: number
  month?: number
  year?: number
  day_of_week?: string
}

export interface DeliverySettings {
  min_days: number
  max_days: number
  exclude_weekends: boolean
  available_dates: DateOption[]
  time_slots: {
    start: string
    end: string
    label: string
  }[]
}

export interface SiteSettings {
  contacts?: unknown
  social?: unknown
  popular_categories?: unknown
  delivery?: DeliverySettings
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const response = await wpApiClient.GET('/ultra/v1/site-settings', {});

  const data = parseDataFromFetchResponse(response);

  return returnOrThrowWhenEmpty(data);
};
