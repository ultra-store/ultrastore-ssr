import createClient from 'openapi-fetch';

import type { paths } from './v1';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.space'}/wp-json`;

const client = createClient<paths>({
  baseUrl,
  // Optional: Add default headers for cache control
  // headers: {
  //   'Cache-Control': 'no-cache',
  // }
});

export default client;
