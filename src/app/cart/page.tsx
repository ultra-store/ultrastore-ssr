'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/woocommerce';

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9.2M7 13l1.8-9.2M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 19v2m6-2v2" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ваша корзина пуста</h1>
          <p className="text-lg text-gray-600 mb-8">
            Добавьте товары в корзину, чтобы продолжить покупки
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                  <Link href={`/product/${item.slug}`}>
                    <Image
                      src={item.image || '/placeholder-product.svg'}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover object-center hover:opacity-75 transition-opacity duration-200"
                    />
                  </Link>
                </div>

                {/* Product Info */}
                <div className="flex-1 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link 
                          href={`/product/${item.slug}`}
                          className="hover:text-blue-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)} за единицу
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Удалить из корзины"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4">
                    <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-700 mr-4">
                      Количество:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <input
                        type="number"
                        id={`quantity-${item.id}`}
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-center border-0 focus:ring-0"
                      />
                      
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="ml-auto">
                      <span className="text-lg font-medium text-gray-900">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Итого по заказу</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары ({state.itemCount} шт.)</span>
                <span className="text-gray-900">{formatPrice(state.total)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка</span>
                <span className="text-gray-900">Бесплатно</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Итого</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(state.total)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 mt-6 block text-center"
            >
              Перейти к оформлению
            </Link>

            <Link
              href="/catalog"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 mt-3 block text-center"
            >
              Продолжить покупки
            </Link>

            {/* Additional Info */}
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Бесплатная доставка от 2000 ₽
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Безопасная оплата
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Возврат в течение 14 дней
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}