import createClient from 'openapi-fetch';

import type { paths } from './v1';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.online'}/wp-json`;

const client = createClient<paths>({ baseUrl });

export default client;
