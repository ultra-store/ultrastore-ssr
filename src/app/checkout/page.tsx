'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/woocommerce';
import { woocommerce } from '@/lib/woocommerce';
import { CreateOrderPayload } from '@/types/woocommerce';
import { Button, Card, CardBody, CardHeader, Divider, Input, Textarea, RadioGroup, Radio, Alert } from '@heroui/react';

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card shadow="sm">
          <CardBody className="py-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9.2M7 13l1.8-9.2M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 19v2m6-2v2" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Корзина пуста</h1>
            <p className="text-lg text-gray-600 mb-8">Добавьте товары в корзину для оформления заказа</p>
            <Button as={Link} href="/catalog" color="primary" size="lg">Перейти в каталог</Button>
          </CardBody>
        </Card>
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
          product_id: item.productId ?? item.id,
          variation_id: item.variationId,
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
            <Card shadow="sm" className="mb-6">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-900">Контактная информация</h2>
              </CardHeader>
              <CardBody className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Имя"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    isRequired
                  />
                  <Input
                    label="Фамилия"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    isRequired
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Input
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isRequired
                  />
                  <Input
                    type="tel"
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isRequired
                  />
                </div>
              </CardBody>
            </Card>

            {/* Shipping Address */}
            <Card shadow="sm" className="mb-6">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-900">Адрес доставки</h2>
              </CardHeader>
              <CardBody className="pt-4">
                <div className="mb-4">
                  <Input
                    label="Адрес"
                    name="address_1"
                    value={formData.address_1}
                    onChange={handleInputChange}
                    placeholder="Улица, дом, квартира"
                    isRequired
                  />
                </div>
                <div className="mb-4">
                  <Input
                    label="Дополнительный адрес"
                    name="address_2"
                    value={formData.address_2}
                    onChange={handleInputChange}
                    placeholder="Подъезд, этаж, домофон"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Город"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    isRequired
                  />
                  <Input
                    label="Регион"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Индекс"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    isRequired
                  />
                </div>
              </CardBody>
            </Card>

            {/* Payment Method */}
            <Card shadow="sm" className="mb-6">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-900">Способ оплаты</h2>
              </CardHeader>
              <CardBody className="pt-4">
                <RadioGroup
                  value={formData.payment_method}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, payment_method: val }))}
                >
                  <Radio value="cod" description="Наличными или картой курьеру">Оплата при получении</Radio>
                  <Radio value="online" description="Банковской картой на сайте">Онлайн оплата</Radio>
                </RadioGroup>
              </CardBody>
            </Card>

            {/* Order Notes */}
            <Card shadow="sm">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-900">Комментарий к заказу</h2>
              </CardHeader>
              <CardBody className="pt-4">
                <Textarea
                  name="customer_note"
                  value={formData.customer_note}
                  onChange={handleInputChange}
                  placeholder="Дополнительная информация о заказе..."
                  minRows={4}
                />
              </CardBody>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card shadow="sm" className="sticky top-6">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-900">Ваш заказ</h2>
              </CardHeader>
              <CardBody className="pt-4">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {state.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className="flex items-center">
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
                      {index < state.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </div>
                {/* Order Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Товары ({state.itemCount} шт.)</span>
                    <span className="text-gray-900">{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка</span>
                    <span className="text-gray-900">Бесплатно</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Итого</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(state.total)}</span>
                  </div>
                </div>
                {/* Error Message */}
                {error && (
                  <Alert color="danger" variant="flat" className="mt-4">
                    {error}
                  </Alert>
                )}
                {/* Submit Button */}
                <Button type="submit" color="primary" className="w-full mt-6" size="lg" isLoading={isSubmitting}>
                  {isSubmitting ? 'Оформляем заказ...' : 'Оформить заказ'}
                </Button>
                <Button as={Link} href="/cart" variant="bordered" className="w-full mt-3">
                  Вернуться в корзину
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}