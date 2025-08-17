'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WooCommerceProduct } from '@/types/woocommerce';
import { formatPrice, getProductImage } from '@/lib/woocommerce';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      image: getProductImage(product)
    });
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={getProductImage(product)}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.svg';
            }}
          />
        </Link>
        
        {/* Sale Badge */}
        {product.on_sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            СКИДКА
          </div>
        )}
        
        {/* Stock Status */}
        {product.stock_status === 'outofstock' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">НЕТ В НАЛИЧИИ</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          <Link 
            href={`/product/${product.slug}`}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {product.name}
          </Link>
        </h3>
        
        {/* Short Description */}
        {product.short_description && (
          <div 
            className="text-xs text-gray-600 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.on_sale && product.regular_price ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {product.average_rating && parseFloat(product.average_rating) > 0 && (
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-xs text-gray-600 ml-1">
                {product.average_rating}
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_status === 'outofstock'}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              product.stock_status === 'outofstock'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {product.stock_status === 'outofstock' ? 'Нет в наличии' : 'В корзину'}
          </button>
          
          {quantity > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {quantity}
            </span>
          )}
        </div>

        {/* Product Meta */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          {product.sku && (
            <span>Артикул: {product.sku}</span>
          )}
          
          {product.categories && product.categories.length > 0 && (
            <span>{product.categories[0].name}</span>
          )}
        </div>
      </div>
    </div>
  );
}