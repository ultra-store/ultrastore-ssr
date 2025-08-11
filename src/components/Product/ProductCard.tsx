import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Card, Text, Flex} from "@gravity-ui/uikit";
import {WooCommerceProduct} from "@/types/woocommerce";
import {getProductImage} from "@/lib/woocommerce";
import {ProductPrice} from "./ProductPrice";

interface ProductCardProps {
  product: WooCommerceProduct;
}

export function ProductCard({product}: ProductCardProps) {
  const img = getProductImage(product);

  return (
    <Card style={{height: '100%'}}>
      <Flex direction="column" gap="3">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={img}
            alt={product.name}
            width={400}
            height={400}
            style={{width: '100%', height: 'auto'}}
          />
        </Link>
        <Flex direction="column" gap="2" style={{padding: 12}}>
          <Link href={`/product/${product.slug}`}>
            <Text variant="body-1">{product.name}</Text>
          </Link>
          <ProductPrice price={product.price || product.regular_price} />
        </Flex>
      </Flex>
    </Card>
  );
}


