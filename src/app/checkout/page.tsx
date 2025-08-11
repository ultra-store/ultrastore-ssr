"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Container, Flex, Text, TextInput, Button, Alert} from "@gravity-ui/uikit";
import {useCart} from "@/contexts/CartContext";
import {woocommerce} from "@/lib/woocommerce";

export default function CheckoutPage() {
  const router = useRouter();
  const {state, clearCart} = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    city: "",
    postcode: "",
    country: "RU",
  });

  const onChange = (k: keyof typeof form) => (v: string) => setForm((s) => ({...s, [k]: v}));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const order = await woocommerce.createOrder({
        payment_method: "cod",
        payment_method_title: "Cash on Delivery",
        set_paid: false,
        billing: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address_1,
          address_2: "",
          city: form.city,
          state: "",
          postcode: form.postcode,
          country: form.country,
          email: form.email,
          phone: form.phone,
          company: "",
        },
        shipping: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address_1,
          address_2: "",
          city: form.city,
          state: "",
          postcode: form.postcode,
          country: form.country,
          company: "",
        },
        line_items: state.items.map((i) => ({product_id: i.id, quantity: i.quantity})),
      });
      clearCart();
      router.push(`/order-success/${order.id}`);
    } catch (err: any) {
      setError(err?.message || "Ошибка при создании заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Flex direction="column" gap="6" style={{marginTop: 24}}>
        <Text variant="header-2">Оформление заказа</Text>
        {error && <Alert theme="danger" title={error} />}
        <form onSubmit={submit}>
          <Flex direction="column" gap="4" style={{maxWidth: 520}}>
            <TextInput label="Имя" value={form.first_name} onUpdate={onChange('first_name')} />
            <TextInput label="Фамилия" value={form.last_name} onUpdate={onChange('last_name')} />
            <TextInput type="email" label="Email" value={form.email} onUpdate={onChange('email')} />
            <TextInput label="Телефон" value={form.phone} onUpdate={onChange('phone')} />
            <TextInput label="Адрес" value={form.address_1} onUpdate={onChange('address_1')} />
            <TextInput label="Город" value={form.city} onUpdate={onChange('city')} />
            <TextInput label="Индекс" value={form.postcode} onUpdate={onChange('postcode')} />
            <Flex justifyContent="flex-end">
              <Button type="submit" view="action" size="l" disabled={!state.itemCount} loading={loading}>
                Создать заказ
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
}


