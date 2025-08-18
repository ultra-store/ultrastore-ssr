'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/woocommerce';
import { Button, Card, CardBody, CardHeader, CardFooter, Divider, Input, Chip } from '@heroui/react';
import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="py-12 text-center">
          <ShoppingCartIcon className="w-20 h-20 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ваша корзина пуста</h1>
          <p className="text-lg text-gray-600 mb-8">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Button as={Link} href="/catalog" color="primary" size="lg" startContent={<ShoppingCartIcon className="w-5 h-5" />}>Перейти в каталог</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
        <Chip variant="flat">Товаров: {state.itemCount}</Chip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card shadow="sm">
            {state.items.map((item, index) => (
              <React.Fragment key={item.id}>
              <div className="flex items-center p-6">
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
                        <Link href={`/product/${item.slug}`} className="hover:text-blue-600 transition-colors duration-200">
                          {item.name}
                        </Link>
                      </h3>
                      {item.attributes && item.attributes.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          {item.attributes.map((a, idx) => (
                            <span key={`${a.name}-${idx}`}>{a.name}: {a.option}{idx < item.attributes!.length - 1 ? ', ' : ''}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)} за единицу
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button isIconOnly variant="light" color="danger" onPress={() => removeItem(item.id)} aria-label="Удалить из корзины">
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4">
                    <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-700 mr-4">
                      Количество:
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="bordered"
                        size="sm"
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        id={`quantity-${item.id}`}
                        value={String(item.quantity)}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                        className="w-20"
                        classNames={{ input: 'text-center' }}
                        min={1}
                        max={99}
                      />
                      <Button
                        isIconOnly
                        variant="bordered"
                        size="sm"
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
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
              {index < state.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card shadow="sm" className="sticky top-6">
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold text-gray-900">Итого по заказу</h2>
            </CardHeader>
            <CardBody className="pt-4">
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
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Итого</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(state.total)}</span>
                </div>
              </div>
              <Button as={Link} href="/checkout" color="primary" className="w-full mt-6">Перейти к оформлению</Button>
              <Button as={Link} href="/catalog" variant="bordered" className="w-full mt-3">Продолжить покупки</Button>
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  Бесплатная доставка от 2000 ₽
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  Безопасная оплата
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  Возврат в течение 14 дней
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}