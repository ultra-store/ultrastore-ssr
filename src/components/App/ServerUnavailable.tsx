"use client";
import React from "react";
import {Container, Flex, Text, Button} from "@gravity-ui/uikit";

export function ServerUnavailable() {
  return (
    <Container>
      <Flex direction="column" alignItems="center" gap="4" style={{marginTop: 64, textAlign: 'center'}}>
        <Text variant="header-2">Сервер недоступен</Text>
        <Text variant="body-2" color="secondary">
          Не удалось подключиться к серверу магазина. Попробуйте обновить страницу позже.
        </Text>
        <Button view="action" onClick={() => (typeof window !== 'undefined' ? window.location.reload() : undefined)}>
          Обновить страницу
        </Button>
      </Flex>
    </Container>
  );
}


