import React from "react";
import {Row, Col, Container} from "@gravity-ui/uikit";
import {WooCommerceProduct} from "@/types/woocommerce";
import {ProductCard} from "./ProductCard";

interface ProductGridProps {
  products: WooCommerceProduct[];
}

export function ProductGrid({products}: ProductGridProps) {
  return (
    <Container>
      <Row spaceRow="4">
        {products.map((p) => (
          <Col key={p.id} s={12} m={6} l={4} xl={3}>
            <ProductCard product={p} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}


