"use client";

import React from "react";
import Link from "next/link";
import {Container, Flex, Text, Button, Icon} from "@gravity-ui/uikit";
import {House, Tag, ShoppingCart, Bars} from "@gravity-ui/icons";

export const Header: React.FC = () => {
  return (
    <header>
      <Container>
        <Flex justifyContent="space-between" alignItems="center" gap="3" style={{minHeight: 56}}>
          {/* Logo */}
          <Link href="/">
            <Text variant="header-2">UltraStore</Text>
          </Link>

          {/* Navigation */}
          <Flex as="nav" gap="4">
            <Button view="flat" href="/">
              <Button.Icon side="left">
                <Icon data={House} />
              </Button.Icon>
              Главная
            </Button>
            <Button view="flat" href="/catalog">
              <Button.Icon side="left">
                <Icon data={Tag} />
              </Button.Icon>
              Каталог
            </Button>
          </Flex>

          {/* Actions */}
          <Flex gap="3" alignItems="center">
            <Button view="outlined" href="/cart">
              <Button.Icon side="left">
                <Icon data={ShoppingCart} />
              </Button.Icon>
              Корзина
            </Button>
            <Button view="flat">
              <Button.Icon>
                <Icon data={Bars} />
              </Button.Icon>
            </Button>
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};


