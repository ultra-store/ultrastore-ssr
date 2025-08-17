import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { woocommerce, formatPrice, getProductImage } from '@/lib/woocommerce';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60; // Обновляем кэш каждые 60 секунд

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  try {
    const product = await woocommerce.getProductBySlug(slug);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(productId: number, categoryIds: number[]) {
  try {
    if (categoryIds.length === 0) return [];
    
    const products = await woocommerce.getProducts({
      category: categoryIds[0].toString(),
      per_page: 4
    });
    return products.filter(p => p.id !== productId);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const categoryIds = product.categories.map(cat => cat.id);
  const relatedProducts = await getRelatedProducts(product.id, categoryIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Главная
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/catalog" className="text-gray-500 hover:text-blue-600">
                Каталог
              </Link>
            </div>
          </li>
          {product.categories.length > 0 && (
            <li>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">{product.categories[0].name}</span>
              </div>
            </li>
          )}
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
            <Image
              src={getProductImage(product)}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover object-center"
              priority
            />
          </div>
          
          {/* Additional Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={image.id} className="aspect-square overflow-hidden rounded bg-gray-200">
                  <Image
                    src={image.src}
                    alt={`${product.name} - изображение ${index + 2}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover object-center cursor-pointer hover:opacity-75"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            {product.on_sale && product.regular_price ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.regular_price)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  СКИДКА
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div 
              className="text-lg text-gray-700 mb-6"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock_status === 'instock' ? (
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                В наличии
                {product.manage_stock && product.stock_quantity !== null && (
                  <span className="ml-2 text-gray-500">
                    ({product.stock_quantity} шт.)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Нет в наличии
              </div>
            )}
          </div>

          {/* Product Meta */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.sku && (
                <div>
                  <span className="font-medium text-gray-900">Артикул:</span>
                  <span className="ml-2 text-gray-600">{product.sku}</span>
                </div>
              )}
              
              {product.categories.length > 0 && (
                <div>
                  <span className="font-medium text-gray-900">Категория:</span>
                  <span className="ml-2 text-gray-600">{product.categories[0].name}</span>
                </div>
              )}

              {product.weight && (
                <div>
                  <span className="font-medium text-gray-900">Вес:</span>
                  <span className="ml-2 text-gray-600">{product.weight} кг</span>
                </div>
              )}

              {product.average_rating && parseFloat(product.average_rating) > 0 && (
                <div>
                  <span className="font-medium text-gray-900">Рейтинг:</span>
                  <span className="ml-2 text-gray-600">
                    {product.average_rating}/5 ★ ({product.rating_count} отзывов)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="border-t border-gray-200 pt-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <Image
                      src={getProductImage(relatedProduct)}
                      alt={relatedProduct.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    {relatedProduct.name}
                  </Link>
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatPrice(relatedProduct.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}