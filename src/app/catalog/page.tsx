import React, { Suspense } from 'react';
import Link from 'next/link';
import { woocommerce } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';
import { WooCommerceProduct, WooCommerceCategory } from '@/types/woocommerce';
import { Card, CardBody, CardHeader, Divider, Input, Button, Chip, Skeleton } from '@heroui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const revalidate = 60; // Обновляем кэш каждые 60 секунд

interface CatalogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    featured?: string;
    on_sale?: string;
  }>;
}

type CatalogSearchParams = Awaited<CatalogPageProps['searchParams']>;

async function getProducts(searchParams: CatalogSearchParams) {
  try {
    const page = parseInt(searchParams.page || '1');
    const per_page = 12;
    
    const params: Record<string, string | number | boolean> = {
      page,
      per_page,
      status: 'publish'
    };

    if (searchParams.search) {
      params.search = searchParams.search;
    }

    if (searchParams.category) {
      params.category = searchParams.category;
    }

    if (searchParams.featured === 'true') {
      params.featured = true;
    }

    if (searchParams.on_sale === 'true') {
      params.on_sale = true;
    }

    const products = await woocommerce.getProducts(params);
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await woocommerce.getCategories();
    const categoriesArray = Array.isArray(categories) ? categories : [];
    return categoriesArray.filter((cat: WooCommerceCategory & { count: number }) => cat.count > 0); // Показываем только категории с товарами
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

function ProductGrid({ products }: { products: WooCommerceProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
        <p className="text-gray-500">Попробуйте изменить параметры поиска или выберите другую категорию</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="rounded-lg mb-4">
            <div className="aspect-square rounded-lg" />
          </Skeleton>
          <Skeleton className="h-4 rounded mb-2" />
          <Skeleton className="h-4 rounded w-3/4 mb-2" />
          <Skeleton className="h-6 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // Await searchParams для Next.js 15
  const resolvedSearchParams = await searchParams;
  
  const [products, categories] = await Promise.all([
    getProducts(resolvedSearchParams),
    getCategories()
  ]);

  const currentPage = parseInt(resolvedSearchParams.page || '1');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card shadow="sm">
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold">Фильтры</h2>
            </CardHeader>
            <CardBody className="pt-4">
              {/* Search */}
              <div className="mb-6">
                <form action="/catalog" method="GET" className="space-y-2">
                  <Input
                    name="search"
                    id="search"
                    defaultValue={resolvedSearchParams.search || ''}
                    placeholder="Введите название товара"
                    startContent={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                  />
                  <Button type="submit" color="primary" className="w-full">
                    Найти
                  </Button>
                </form>
              </div>

              <Divider className="my-4" />

              {/* Quick Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Быстрые фильтры</h3>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    as={Link}
                    href="/catalog?featured=true"
                    color={resolvedSearchParams.featured === 'true' ? 'primary' : 'default'}
                    variant={resolvedSearchParams.featured === 'true' ? 'solid' : 'flat'}
                  >
                    Рекомендуемые
                  </Chip>
                  <Chip
                    as={Link}
                    href="/catalog?on_sale=true"
                    color={resolvedSearchParams.on_sale === 'true' ? 'danger' : 'default'}
                    variant={resolvedSearchParams.on_sale === 'true' ? 'solid' : 'flat'}
                  >
                    Со скидкой
                  </Chip>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Категории</h3>
                  <div className="flex flex-col gap-2">
                    <Chip
                      as={Link}
                      href="/catalog"
                      color={!resolvedSearchParams.category ? 'primary' : 'default'}
                      variant={!resolvedSearchParams.category ? 'solid' : 'flat'}
                    >
                      Все категории
                    </Chip>
                    {categories.map((category: WooCommerceCategory & { count: number }) => (
                      <Chip
                        key={category.id}
                        as={Link}
                        href={`/catalog?category=${category.id}`}
                        color={resolvedSearchParams.category === category.id.toString() ? 'primary' : 'default'}
                        variant={resolvedSearchParams.category === category.id.toString() ? 'solid' : 'flat'}
                      >
                        {category.name} ({category.count})
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              {resolvedSearchParams.search && `Результаты поиска: "${resolvedSearchParams.search}"`}
              {resolvedSearchParams.featured === 'true' && 'Рекомендуемые товары'}
              {resolvedSearchParams.on_sale === 'true' && 'Товары со скидкой'}
              {!resolvedSearchParams.search && !resolvedSearchParams.featured && !resolvedSearchParams.on_sale && 'Каталог товаров'}
            </h1>
            
            <Chip variant="flat" className="w-max">Найдено товаров: {products.length}</Chip>
          </div>

          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>

          {/* Pagination */}
          {products.length === 12 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {currentPage > 1 && (
                  <a
                    href={`/catalog?${new URLSearchParams({
                      ...resolvedSearchParams,
                      page: (currentPage - 1).toString()
                    }).toString()}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Предыдущая
                  </a>
                )}
                
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-300 rounded-md">
                  Страница {currentPage}
                </span>
                
                <a
                  href={`/catalog?${new URLSearchParams({
                    ...resolvedSearchParams,
                    page: (currentPage + 1).toString()
                  }).toString()}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Следующая
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}