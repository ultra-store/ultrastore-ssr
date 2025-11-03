# Ultrastore SSR

Basic Next.js store layout.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

- `NEXT_PUBLIC_API_BASE_URL` - API base URL (default: https://backend.ultrastore.khizrim.space)
- `NEXT_PUBLIC_REVALIDATE_SECRET` - Secret token for cache revalidation
- `NEXT_PUBLIC_FEATURE_COMPARISON_ENABLED` - Enable/disable comparison feature (default: false)
- `NEXT_PUBLIC_FEATURE_FAVORITES_ENABLED` - Enable/disable favorites feature (default: false)
- `WC_CONSUMER_KEY` - WooCommerce REST API Consumer Key (required for order submission)
- `WC_CONSUMER_SECRET` - WooCommerce REST API Consumer Secret (required for order submission)
- `NEXT_PUBLIC_DADATA_API_TOKEN` - DaData API token for address suggestions (optional)

**Note**: For WooCommerce API credentials, you can use either:
- `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` (server-side only, more secure)
- `NEXT_PUBLIC_WC_CONSUMER_KEY` / `NEXT_PUBLIC_WC_CONSUMER_SECRET` (exposed to client, less secure)

To get WooCommerce API credentials:
1. Go to WordPress Admin → WooCommerce → Settings → Advanced → REST API
2. Click "Add Key" and create a new key with Read/Write permissions
3. Copy the Consumer Key and Consumer Secret to your `.env.local` file

To get DaData API token:
1. Register at [DaData.ru](https://dadata.ru/)
2. Go to your account settings and generate an API token
3. Copy the token to your `.env.local` file as `NEXT_PUBLIC_DADATA_API_TOKEN`
4. Note: Without the token, address autocomplete will not work (but the form will still function)

**Important**: After updating `.env.local`, you must restart the development server for changes to take effect.

Feature flags accept `"true"` or `"1"` to enable, anything else or unset to disable.

