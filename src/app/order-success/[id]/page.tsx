import {woocommerce} from "@/lib/woocommerce";
import {Container, Flex, Text} from "@gravity-ui/uikit";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({params}: {params: Promise<{id: string}>}) {
  const p = await params;
  const order = await woocommerce.getOrder(Number(p.id));

  return (
    <Container>
      <Flex direction="column" gap="4" style={{marginTop: 24}}>
        <Text variant="header-2">Заказ создан</Text>
        <Text variant="subheader-2">Номер заказа: {order.number}</Text>
        <Text>Статус: {order.status}</Text>
        <Text>Итоговая сумма: {order.total} {order.currency}</Text>
      </Flex>
    </Container>
  );
}


