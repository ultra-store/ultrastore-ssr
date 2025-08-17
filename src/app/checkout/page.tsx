'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/woocommerce';
import { woocommerce } from '@/lib/woocommerce';
import { CreateOrderPayload } from '@/types/woocommerce';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  payment_method: string;
  customer_note: string;
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'RU',
    payment_method: 'cod',
    customer_note: ''
  });

  // Если корзина пуста, перенаправляем в каталог
  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9.2M7 13l1.8-9.2M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 19v2m6-2v2" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Корзина пуста</h1>
          <p className="text-lg text-gray-600 mb-8">
            Добавьте товары в корзину для оформления заказа
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Формируем данные заказа для WooCommerce
      const orderData: CreateOrderPayload = {
        payment_method: formData.payment_method,
        payment_method_title: formData.payment_method === 'cod' ? 'Оплата при получении' : 'Онлайн оплата',
        set_paid: false,
        billing: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: '',
          address_1: formData.address_1,
          address_2: formData.address_2,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: '',
          address_1: formData.address_1,
          address_2: formData.address_2,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country
        },
        line_items: state.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        customer_note: formData.customer_note
      };

      // Отправляем заказ в WooCommerce
      const order = await woocommerce.createOrder(orderData);
      
      console.log('Order created successfully:', order);

      // Очищаем корзину
      clearCart();

      // Перенаправляем на страницу успеха
      router.push(`/order-success?id=${order.id}`);

    } catch (error) {
      console.error('Error creating order:', error);
      setError('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Контактная информация</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Адрес доставки</h2>
              
              <div className="mb-4">
                <label htmlFor="address_1" className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес *
                </label>
                <input
                  type="text"
                  id="address_1"
                  name="address_1"
                  required
                  value={formData.address_1}
                  onChange={handleInputChange}
                  placeholder="Улица, дом, квартира"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address_2" className="block text-sm font-medium text-gray-700 mb-1">
                  Дополнительный адрес
                </label>
                <input
                  type="text"
                  id="address_2"
                  name="address_2"
                  value={formData.address_2}
                  onChange={handleInputChange}
                  placeholder="Подъезд, этаж, домофон"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Город *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Регион
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Индекс *
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    required
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Способ оплаты</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={formData.payment_method === 'cod'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Оплата при получении</div>
                    <div className="text-sm text-gray-600">Наличными или картой курьеру</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="online"
                    checked={formData.payment_method === 'online'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Онлайн оплата</div>
                    <div className="text-sm text-gray-600">Банковской картой на сайте</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Комментарий к заказу</h2>
              
              <textarea
                id="customer_note"
                name="customer_note"
                rows={4}
                value={formData.customer_note}
                onChange={handleInputChange}
                placeholder="Дополнительная информация о заказе..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Ваш заказ</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-200">
                      <Image
                        src={item.image || '/placeholder-product.svg'}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(parseFloat(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
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
                    <span className="text-lg font-medium text-gray-900">Итого</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(state.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Оформляем заказ...
                  </>
                ) : (
                  'Оформить заказ'
                )}
              </button>

              <Link
                href="/cart"
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 mt-3 block text-center"
              >
                Вернуться в корзину
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}