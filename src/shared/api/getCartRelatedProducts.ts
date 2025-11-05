import type { Product } from '@/shared/types';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.space'}/wp-json`;

export async function getCartRelatedProducts(
  productIds: number[],
  limit = 8,
  options: { signal?: AbortSignal } = {},
): Promise<Product[]> {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams();

  params.set('product_ids', productIds.join(','));
  params.set('limit', String(limit));

  const url = `${baseUrl}/ultra/v1/cart/related?${params.toString()}`;
  const response = await fetch(url, {
    next: { revalidate: 30 },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart related products: ${response.statusText}`);
  }

  const data = await response.json();

  // Endpoint returns array of Product summaries
  return Array.isArray(data) ? (data as Product[]) : [];
}
