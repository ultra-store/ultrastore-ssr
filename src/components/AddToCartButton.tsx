'use client';

import React, { useState } from 'react';
import { WooCommerceProduct } from '@/types/woocommerce';
import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/lib/woocommerce';

interface AddToCartButtonProps {
  product: WooCommerceProduct;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const currentQuantity = getItemQuantity(product.id);

  const handleAddToCart = async () => {
    if (product.stock_status === 'outofstock') return;

    setIsAdding(true);
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        slug: product.slug,
        image: getProductImage(product)
      });

      // Показываем уведомление об успешном добавлении
      // Здесь можно добавить toast или другое уведомление
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock_status === 'outofstock';
  const maxQuantity = product.manage_stock && product.stock_quantity 
    ? product.stock_quantity 
    : 99;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
          Количество:
        </label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <input
            type="number"
            id="quantity"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
            className="w-16 px-2 py-1 text-center border-0 focus:ring-0"
          />
          
          <button
            type="button"
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`flex-1 flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md transition-colors duration-200 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Добавляем...
            </>
          ) : isOutOfStock ? (
            'Нет в наличии'
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9.2M7 13l1.8-9.2M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 19v2m6-2v2" />
              </svg>
              Добавить в корзину
            </>
          )}
        </button>

        {/* Buy Now Button */}
        {!isOutOfStock && (
          <button
            onClick={() => {
              handleAddToCart();
              // Перенаправляем на страницу корзины
              window.location.href = '/cart';
            }}
            disabled={isAdding}
            className="flex-1 sm:flex-none px-8 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Купить сейчас
          </button>
        )}
      </div>

      {/* Current Cart Quantity */}
      {currentQuantity > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-blue-800 text-sm">
              В корзине: {currentQuantity} шт.
            </span>
          </div>
        </div>
      )}

      {/* Stock Warning */}
      {product.manage_stock && product.stock_quantity !== null && product.stock_quantity < 10 && product.stock_quantity > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-orange-800 text-sm">
              Осталось всего {product.stock_quantity} шт.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}