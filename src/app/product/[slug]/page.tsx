import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { woocommerce, formatPrice, getProductImage } from '@/lib/woocommerce';
// Removed direct AddToCartButton usage in favor of VariationSelectorAndAddToCart
import ProductImagesGallery from '@/components/ProductImagesGallery';
import VariationSelectorAndAddToCart from '@/components/VariationSelectorAndAddToCart';
import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider
} from '@heroui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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
      <div className="mb-8">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Главная</BreadcrumbItem>
          <BreadcrumbItem href="/catalog">Каталог</BreadcrumbItem>
          {product.categories.length > 0 && (
            <BreadcrumbItem>{product.categories[0].name}</BreadcrumbItem>
          )}
          <BreadcrumbItem>{product.name}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <ProductImagesGallery images={product.images} name={product.name} />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Price (base, variation price handled in client via AddToCartButton props) */}
          <div className="flex items-center gap-4 mb-6">
            {product.on_sale && product.regular_price ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.regular_price)}
                </span>
                <Chip color="danger" size="sm" variant="solid">СКИДКА</Chip>
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
              <Chip color="success" variant="flat" startContent={<CheckCircleIcon className="w-5 h-5" />}>
                В наличии{product.manage_stock && product.stock_quantity !== null ? ` (${product.stock_quantity} шт.)` : ''}
              </Chip>
            ) : (
              <Chip color="danger" variant="flat" startContent={<XCircleIcon className="w-5 h-5" />}>
                Нет в наличии
              </Chip>
            )}
          </div>

          {/* Product Meta */}
          <Divider className="my-6" />
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

          {/* Add to Cart with variations */}
          <div className="mt-6">
            <VariationSelectorAndAddToCart product={product} />
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="pt-8 mb-12">
          <Divider className="mb-8" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8">
          <Divider className="mb-8" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} shadow="sm" className="group">
                <CardBody className="p-0">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                      <Image
                        src={getProductImage(relatedProduct)}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </Link>
                </CardBody>
                <CardFooter className="flex flex-col items-start gap-1">
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product/${relatedProduct.slug}`}>
                      {relatedProduct.name}
                    </Link>
                  </h3>
                  <p className="text-lg font-medium text-gray-900">
                    {formatPrice(relatedProduct.price)}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}