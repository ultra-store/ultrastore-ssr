"use client";

import React from "react";
import {Button, Flex, Text} from "@gravity-ui/uikit";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityInput({value, onChange, min = 1, max = 99}: QuantityInputProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <Flex alignItems="center" gap="3">
      <Button view="flat" onClick={dec} disabled={value <= min}>-</Button>
      <Text variant="body-2">{value}</Text>
      <Button view="flat" onClick={inc} disabled={value >= max}>+</Button>
    </Flex>
  );
}


