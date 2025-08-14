import {ProductGrid} from "@/components/Product/ProductGrid";
import {woocommerce} from "@/lib/woocommerce";
import {Pagination} from "@/components/Catalog/Pagination";
import {Container, Flex, TextInput, Button} from "@gravity-ui/uikit";

export const dynamic = "force-dynamic";

interface SearchParams {
  search?: string;
  page?: string;
  per_page?: string;
}

export default async function Catalog({searchParams}: {searchParams: Promise<SearchParams>}) {
  const sp = await searchParams;
  const page = Number(sp.page || 1);
  const per_page = Number(sp.per_page || 12);
  const search = sp.search || undefined;

  // WooCommerce API doesn't directly return total pages via axios headers in our wrapper
  // For a minimal version, fetch one extra page to estimate hasNext
  let products = [] as Awaited<ReturnType<typeof woocommerce.getProducts>>;
  let nextProducts = [] as Awaited<ReturnType<typeof woocommerce.getProducts>>;
  try {
    products = await woocommerce.getProducts({page, per_page, search});
    nextProducts = await woocommerce.getProducts({page: page + 1, per_page, search});
  } catch {
    products = [];
    nextProducts = [];
  }
  const totalPages = products.length === 0 && page > 1 ? page : nextProducts.length > 0 ? page + 1 : page;

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" style={{margin: 16}}>
        {/* Simple search form using GET */}
        <form action="/catalog">
          <Flex gap="3" alignItems="center">
            <TextInput name="search" defaultValue={search} placeholder="Поиск товаров" />
            <Button type="submit" view="action">Найти</Button>
          </Flex>
        </form>
      </Flex>
      <ProductGrid products={products} />
      <Pagination page={page} totalPages={totalPages} basePath="/catalog" query={{search, per_page}} />
    </Container>
  );
}


