'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { woocommerce, formatPrice } from '@/lib/woocommerce';
import { WooCommerceOrder } from '@/types/woocommerce';

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-600">Загрузка...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<WooCommerceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError('ID заказа не найден');
        setLoading(false);
        return;
      }

      try {
        const orderData = await woocommerce.getOrder(parseInt(orderId));
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Ошибка при загрузке информации о заказе');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем информацию о заказе...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Заказ оформлен!</h1>
        <p className="text-lg text-gray-600">
          Спасибо за покупку. Ваш заказ #{order.number} принят в обработку.
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Информация о заказе</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Номер заказа:</span>
              <span className="font-medium text-gray-900">#{order.number}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Дата заказа:</span>
              <span className="font-medium text-gray-900">
                {new Date(order.date_created).toLocaleDateString('ru-RU')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className={`font-medium px-2 py-1 rounded text-xs ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status === 'pending' && 'Ожидает обработки'}
                {order.status === 'processing' && 'В обработке'}
                {order.status === 'completed' && 'Выполнен'}
                {order.status === 'on-hold' && 'На удержании'}
                {order.status === 'cancelled' && 'Отменен'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Способ оплаты:</span>
              <span className="font-medium text-gray-900">{order.payment_method_title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{order.billing.email}</span>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Адрес доставки</h2>
          
          <div className="text-sm text-gray-700">
            <p className="font-medium">
              {order.billing.first_name} {order.billing.last_name}
            </p>
            <p>{order.billing.address_1}</p>
            {order.billing.address_2 && <p>{order.billing.address_2}</p>}
            <p>
              {order.billing.city}, {order.billing.state} {order.billing.postcode}
            </p>
            <p className="mt-2">
              <span className="text-gray-600">Телефон:</span> {order.billing.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Состав заказа</h2>
        
        <div className="space-y-4">
          {order.line_items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                {item.sku && (
                  <p className="text-xs text-gray-500">Артикул: {item.sku}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
                <p className="text-sm text-gray-600">{formatPrice(item.price)} за шт.</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Товары:</span>
            <span className="text-gray-900">{formatPrice(parseFloat(order.total) - parseFloat(order.shipping_total))}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Доставка:</span>
            <span className="text-gray-900">
              {parseFloat(order.shipping_total) > 0 ? formatPrice(order.shipping_total) : 'Бесплатно'}
            </span>
          </div>
          
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
            <span className="text-gray-900">Итого:</span>
            <span className="text-gray-900">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Customer Note */}
      {order.customer_note && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Комментарий к заказу</h2>
          <p className="text-gray-700">{order.customer_note}</p>
        </div>
      )}

      {/* Actions */}
      <div className="text-center mt-8 space-x-4">
        <Link
          href="/catalog"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Продолжить покупки
        </Link>
        
        <Link
          href="/"
          className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Вернуться на главную
        </Link>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Что дальше?</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Вы получите email с подтверждением заказа</p>
          <p>• Мы свяжемся с вами для уточнения деталей доставки</p>
          <p>• Вы получите уведомление о готовности заказа к доставке</p>
          <p>• Доставка осуществляется в течение 1-3 рабочих дней</p>
        </div>
      </div>
    </div>
  );
}