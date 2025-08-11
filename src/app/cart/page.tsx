"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {useCart} from "@/contexts/CartContext";
import {Button, Container, Flex, Text, Table} from "@gravity-ui/uikit";
import {formatPrice} from "@/lib/woocommerce";

export default function CartPage() {
  const {state, removeItem, updateQuantity} = useCart();

  const columns = [
    {id: 'product', name: 'Товар'},
    {id: 'price', name: 'Цена'},
    {id: 'qty', name: 'Кол-во'},
    {id: 'total', name: 'Итого'},
    {id: 'actions', name: ''},
  ];

  const data = state.items.map((item) => ({
    id: String(item.id),
    product: (
      <Flex alignItems="center" gap="3">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={64} height={64} />
        ) : null}
        <Link href={`/product/${item.slug}`}>{item.name}</Link>
      </Flex>
    ),
    price: formatPrice(item.price),
    qty: (
      <Flex gap="2" alignItems="center">
        <Button view="flat" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
        <Text>{item.quantity}</Text>
        <Button view="flat" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
      </Flex>
    ),
    total: formatPrice(parseFloat(item.price) * item.quantity),
    actions: (
      <Button view="outlined" onClick={() => removeItem(item.id)}>Удалить</Button>
    ),
  }));

  return (
    <Container>
      <Flex direction="column" gap="6" style={{marginTop: 24}}>
        <Text variant="header-2">Корзина</Text>
        <Table columns={columns} data={data} />
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="subheader-2">Итого: {formatPrice(state.total)}</Text>
          <Button view="action" href={state.itemCount ? "/checkout" : undefined} disabled={!state.itemCount}>
            Оформить заказ
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}


