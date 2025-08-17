'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { woocommerce, formatPrice } from '@/lib/woocommerce';
import { WooCommerceOrder } from '@/types/woocommerce';
import { Card, CardBody, CardHeader, Divider, Button, Chip } from '@heroui/react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card shadow="sm">
          <CardBody className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загружаем информацию о заказе...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card shadow="sm">
          <CardBody className="py-12 text-center">
            <ExclamationCircleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button as={Link} href="/" color="primary">Вернуться на главную</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const statusColor = order.status === 'pending' ? 'warning' : order.status === 'processing' ? 'primary' : order.status === 'completed' ? 'success' : 'default';
  const statusLabel = order.status === 'pending'
    ? 'Ожидает обработки'
    : order.status === 'processing'
    ? 'В обработке'
    : order.status === 'completed'
    ? 'Выполнен'
    : order.status === 'on-hold'
    ? 'На удержании'
    : order.status === 'cancelled'
    ? 'Отменен'
    : order.status;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <Card shadow="sm" className="mb-8">
        <CardBody className="text-center py-10">
          <CheckCircleIcon className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Заказ оформлен!</h1>
          <p className="text-lg text-gray-600">Спасибо за покупку. Ваш заказ #{order.number} принят в обработку.</p>
        </CardBody>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Info */}
        <Card shadow="sm">
          <CardHeader className="pb-0">
            <h2 className="text-xl font-semibold text-gray-900">Информация о заказе</h2>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Номер заказа:</span>
                <span className="font-medium text-gray-900">#{order.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дата заказа:</span>
                <span className="font-medium text-gray-900">{new Date(order.date_created).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Статус:</span>
                <Chip size="sm" color={statusColor as any}>{statusLabel}</Chip>
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
          </CardBody>
        </Card>

        {/* Billing Address */}
        <Card shadow="sm">
          <CardHeader className="pb-0">
            <h2 className="text-xl font-semibold text-gray-900">Адрес доставки</h2>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="text-sm text-gray-700">
              <p className="font-medium">{order.billing.first_name} {order.billing.last_name}</p>
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
              <p className="mt-2"><span className="text-gray-600">Телефон:</span> {order.billing.phone}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Order Items */}
      <Card shadow="sm" className="mt-8">
        <CardHeader className="pb-0">
          <h2 className="text-xl font-semibold text-gray-900">Состав заказа</h2>
        </CardHeader>
        <CardBody className="pt-4">
          <div className="space-y-4">
            {order.line_items.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex justify-between items-center py-2">
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
                {index < order.line_items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
          <Divider className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Товары:</span>
              <span className="text-gray-900">{formatPrice(parseFloat(order.total) - parseFloat(order.shipping_total))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Доставка:</span>
              <span className="text-gray-900">{parseFloat(order.shipping_total) > 0 ? formatPrice(order.shipping_total) : 'Бесплатно'}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Итого:</span>
              <span className="text-gray-900">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Customer Note */}
      {order.customer_note && (
        <Card shadow="sm" className="mt-8">
          <CardHeader className="pb-0">
            <h2 className="text-xl font-semibold text-gray-900">Комментарий к заказу</h2>
          </CardHeader>
          <CardBody className="pt-4">
            <p className="text-gray-700">{order.customer_note}</p>
          </CardBody>
        </Card>
      )}

      {/* Actions */}
      <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button as={Link} href="/catalog" color="primary">Продолжить покупки</Button>
        <Button as={Link} href="/" variant="bordered">Вернуться на главную</Button>
      </div>
    </div>
  );
}