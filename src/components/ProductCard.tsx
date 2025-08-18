'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';

import { StarIcon } from '@heroicons/react/24/solid';
import { WooCommerceProduct } from '@/types/woocommerce';
import { formatPrice, getProductImage } from '@/lib/woocommerce';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity, state } = useCart();
  // Aggregate quantity for simple and variable products
  const quantity = useMemo(() => {
    // If cart items carry productId, sum all items that belong to this product
    return state.items.reduce((sum, item) => {
      const matchesByProductId = item.productId === product.id;
      const matchesById = item.id === product.id;
      return sum + (matchesByProductId || matchesById ? item.quantity : 0);
    }, 0);
  }, [state.items, product.id]);
  const showCta = quantity > 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      image: getProductImage(product)
    });
  };

  return (
    <Link href={`/product/${product.slug}`} className="block h-full">
      <Card
        shadow="sm"
        className="group relative h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      >
      <CardBody className="p-0">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
          {product.on_sale && (
            <Chip size="sm" color="danger" className="absolute top-3 left-3">СКИДКА</Chip>
          )}
          {product.stock_status === 'outofstock' && (
            <Chip size="sm" color="default" variant="flat" className="absolute top-3 right-3">Нет в наличии</Chip>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-stretch gap-3 mt-auto">
        <div className="w-full min-h-[3rem]">
          <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.on_sale && product.regular_price ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.average_rating && parseFloat(product.average_rating) > 0 && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700 ml-1">
                {product.average_rating}
              </span>
            </div>
          )}
        </div>
        <div className={`min-h-[44px] flex items-center gap-3 transition-opacity duration-200`}>
          {product.type === 'variable' ? (
            showCta ? (
              <Button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/cart'; }}
                color="primary"
                variant="solid"
                size="md"
                className="flex-1"
              >
                В корзине
              </Button>
            ) : (
              <Button
                // Navigate to product page to select variation (no preventDefault on purpose)
                color="default"
                variant="flat"
                size="md"
                className="flex-1"
              >
                Выбрать вариант
              </Button>
            )
          ) : (
            showCta ? (
              <Button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/cart'; }}
                color="primary"
                variant="solid"
                size="md"
                className="flex-1"
              >
                В корзине
              </Button>
            ) : (
              <Button
                onPress={handleAddToCart}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                disabled={product.stock_status === 'outofstock'}
                color="default"
                variant="flat"
                size="md"
                className="flex-1"
              >
                {product.stock_status === 'outofstock' ? 'Нет в наличии' : 'В корзину'}
              </Button>
            )
          )}
          {quantity > 0 && (
            <div className="bg-blue-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center">
              {quantity > 9 ? '9+' : quantity}
            </div>
          )}
        </div>
      </CardFooter>
      </Card>
    </Link>
  );
}