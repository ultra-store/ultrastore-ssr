import {ProductGrid} from "@/components/Product/ProductGrid";
import {woocommerce} from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const products = await woocommerce.getProducts({featured: true, per_page: 8});
    return <ProductGrid products={products} />;
  } catch {
    return null;
  }
}
