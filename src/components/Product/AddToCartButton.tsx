"use client";

import React, {useState} from "react";
import {Button, Flex} from "@gravity-ui/uikit";
import {QuantityInput} from "./QuantityInput";
import {useCart} from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: string;
    slug: string;
    image?: string;
  };
}

export function AddToCartButton({product}: AddToCartButtonProps) {
  const {addItem} = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem({...product, quantity: qty});
  };

  return (
    <Flex gap="4" alignItems="center">
      <QuantityInput value={qty} onChange={setQty} />
      <Button view="action" size="l" onClick={handleAdd}>В корзину</Button>
    </Flex>
  );
}


