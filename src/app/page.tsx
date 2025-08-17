import Link from 'next/link';
import { woocommerce } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Обновляем кэш каждые 60 секунд

async function getLatestProducts() {
  try {
    const products = await woocommerce.getProducts({
      per_page: 12,
      status: 'publish'
    });
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestProducts = await getLatestProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <section className="text-center py-10 mb-10">
        <h1 className="text-4xl font-bold mb-3">UltraStore</h1>
        <p className="text-lg text-gray-600 mb-6">Современный магазин на WooCommerce и Next.js</p>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Перейти в каталог
        </Link>
      </section>

      {/* Products Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Товары</h2>
          <Link href="/catalog" className="text-blue-600 hover:text-blue-800 font-medium">Все товары →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 pt-6 pb-8 text-center text-sm text-gray-500">
        <div className="mb-2">© {new Date().getFullYear()} UltraStore</div>
        <div className="space-x-4">
          <Link href="/catalog" className="hover:text-gray-700">Каталог</Link>
          <Link href="/cart" className="hover:text-gray-700">Корзина</Link>
          <Link href="/checkout" className="hover:text-gray-700">Оформление</Link>
        </div>
      </footer>
    </div>
  );
}