'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardBody } from '@heroui/react';
import { ShoppingCartIcon, CheckIcon, ExclamationTriangleIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { WooCommerceProduct, WooCommerceProductVariation, WooCommerceVariationAttribute } from '@/types/woocommerce';
import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/lib/woocommerce';

interface AddToCartButtonProps {
  product: WooCommerceProduct;
  selectedVariation?: WooCommerceProductVariation;
  selectedAttributes?: WooCommerceVariationAttribute[];
  className?: string;
}

export default function AddToCartButton({ product, selectedVariation, selectedAttributes, className = '' }: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const cartItemId = selectedVariation ? selectedVariation.id : product.id;
  const currentQuantity = getItemQuantity(cartItemId);

  const handleAddToCart = async () => {
    // For variable products, require variation selection
    if (product.type === 'variable' && !selectedVariation) return;

    const isOutOfStock = selectedVariation
      ? selectedVariation.stock_status === 'outofstock'
      : product.stock_status === 'outofstock';
    if (isOutOfStock) return;

    setIsAdding(true);
    
    try {
      const priceToUse = selectedVariation ? selectedVariation.price : product.price;
      const imageToUse = selectedVariation?.image?.src || getProductImage(product);
      const nameWithAttrs = selectedAttributes && selectedAttributes.length > 0
        ? `${product.name} (${selectedAttributes.map(a => `${a.name}: ${a.option}`).join(', ')})`
        : product.name;

      addItem({
        id: cartItemId,
        productId: product.id,
        variationId: selectedVariation?.id,
        attributes: selectedAttributes,
        name: nameWithAttrs,
        price: priceToUse,
        quantity: quantity,
        slug: product.slug,
        image: imageToUse
      });

      // Показываем уведомление об успешном добавлении
      // Здесь можно добавить toast или другое уведомление
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const effectiveStockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;
  const effectiveManageStock = selectedVariation ? selectedVariation.manage_stock : product.manage_stock;
  const effectiveStockQty = selectedVariation ? selectedVariation.stock_quantity : product.stock_quantity;
  const isOutOfStock = effectiveStockStatus === 'outofstock';
  const maxQuantity = effectiveManageStock && effectiveStockQty
    ? effectiveStockQty
    : 99;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-900">
          Количество:
        </span>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          
          <Input
            type="number"
            value={quantity.toString()}
            onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
            className="w-20"
            classNames={{
              input: "text-center",
            }}
            min="1"
            max={maxQuantity.toString()}
          />
          
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onPress={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onPress={handleAddToCart}
          disabled={isOutOfStock || isAdding || (product.type === 'variable' && !selectedVariation)}
          color={isOutOfStock ? "default" : "primary"}
          variant={isOutOfStock ? "flat" : "solid"}
          size="lg"
          isLoading={isAdding}
          startContent={!isAdding && !isOutOfStock && <ShoppingCartIcon className="h-5 w-5" />}
        >
          {product.type === 'variable' && !selectedVariation
            ? 'Выберите вариант'
            : isOutOfStock
            ? 'Нет в наличии'
            : 'Добавить в корзину'}
        </Button>

        {/* Buy Now Button */}
        {!isOutOfStock && (
          <Button
            onPress={() => {
              handleAddToCart();
              // Перенаправляем на страницу корзины
              window.location.href = '/cart';
            }}
            disabled={isAdding || (product.type === 'variable' && !selectedVariation)}
            variant="bordered"
            color="primary"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            Купить сейчас
          </Button>
        )}
      </div>

      {/* Current Cart Quantity */}
      {currentQuantity > 0 && (
        <Card className="bg-primary-50 border-primary-200">
          <CardBody className="py-3">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-primary-600" />
              <span className="text-primary-800 text-sm font-medium">
                В корзине: {currentQuantity} шт.
              </span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stock Warning */}
      {effectiveManageStock && effectiveStockQty !== null && effectiveStockQty < 10 && effectiveStockQty > 0 && (
        <Card className="bg-warning-50 border-warning-200">
          <CardBody className="py-3">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
              <span className="text-warning-800 text-sm font-medium">
                Осталось всего {effectiveStockQty} шт.
              </span>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}