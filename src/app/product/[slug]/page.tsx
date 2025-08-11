import Image from "next/image";
import {woocommerce, getProductImage, formatPrice} from "@/lib/woocommerce";
import {Container, Flex, Text} from "@gravity-ui/uikit";
import {AddToCartButton} from "@/components/Product/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const product = await woocommerce.getProductBySlug(slug);
  if (!product) {
    const {notFound} = await import("next/navigation");
    return notFound();
  }

  const img = getProductImage(product);

  return (
    <Container>
      <Flex gap="8" style={{marginTop: 24}}>
        <div style={{flex: 1}}>
          <Image src={img} alt={product.name} width={800} height={800} style={{width: '100%', height: 'auto'}} />
        </div>
        <Flex direction="column" gap="4" style={{flex: 1}}>
          <Text variant="header-2">{product.name}</Text>
          <Text variant="subheader-2">{formatPrice(product.price || product.regular_price)}</Text>
          <AddToCartButton product={{id: product.id, name: product.name, price: product.price || product.regular_price, slug: product.slug, image: img}} />
        </Flex>
      </Flex>
    </Container>
  );
}


