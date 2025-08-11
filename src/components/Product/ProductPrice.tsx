import React from "react";
import {Text} from "@gravity-ui/uikit";
import {formatPrice} from "@/lib/woocommerce";

export function ProductPrice({price}: {price: string | number}) {
  return <Text variant="body-2">{formatPrice(price)}</Text>;
}


