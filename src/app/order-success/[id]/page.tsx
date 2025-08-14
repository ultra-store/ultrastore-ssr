import {woocommerce} from "@/lib/woocommerce";
import {Container, Flex, Text} from "@gravity-ui/uikit";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({params}: {params: Promise<{id: string}>}) {
  const p = await params;
  let order: Awaited<ReturnType<typeof woocommerce.getOrder>> | null = null;
  try {
    order = await woocommerce.getOrder(Number(p.id));
  } catch {
    order = null;
  }

  return (
    <Container>
      <Flex direction="column" gap="4" style={{marginTop: 24}}>
        {order ? (
          <>
            <Text variant="header-2">Заказ создан</Text>
            <Text variant="subheader-2">Номер заказа: {order.number}</Text>
            <Text>Статус: {order.status}</Text>
            <Text>Итоговая сумма: {order.total} {order.currency}</Text>
          </>
        ) : (
          <Text>Информация о заказе временно недоступна.</Text>
        )}
      </Flex>
    </Container>
  );
}


