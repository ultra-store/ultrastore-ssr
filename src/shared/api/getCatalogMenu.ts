export interface CatalogCategory {
  id: number
  name: string
  slug: string
  description?: string
  count?: number
  image?: string | null
  path?: string
  seo_blocks?: unknown[]
  children?: CatalogCategory[]
}

export interface CatalogMenuResponse { categories: CatalogCategory[] }

export async function getCatalogMenu(): Promise<CatalogMenuResponse> {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ultrastore.khizrim.space'}/wp-json`;
  const res = await fetch(`${baseUrl}/ultra/v1/catalog-menu`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error('Failed to load catalog menu');
  }

  return res.json();
}
