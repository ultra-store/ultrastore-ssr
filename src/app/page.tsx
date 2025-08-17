import Link from 'next/link';
import { woocommerce } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Обновляем кэш каждые 60 секунд

async function getFeaturedProducts() {
  try {
    const products = await woocommerce.getProducts({
      featured: true,
      per_page: 8,
      status: 'publish'
    });
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Добро пожаловать в UltraStore
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Современный интернет-магазин на базе WooCommerce и Next.js
        </p>
        <div className="space-x-4">
          <Link
            href="/catalog"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Смотреть каталог
          </Link>
          <Link
            href="/catalog?featured=true"
            className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
          >
            Рекомендуемые товары
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Рекомендуемые товары
            </h2>
            <Link
              href="/catalog?featured=true"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Смотреть все →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Почему выбирают нас
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Быстрая загрузка</h3>
            <p className="text-gray-600">Современные технологии для мгновенной загрузки страниц</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
            <p className="text-gray-600">Защищенные платежи и хранение персональных данных</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
            <p className="text-gray-600">Круглосуточная техническая поддержка клиентов</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Готовы начать покупки?
        </h2>
        <p className="text-xl mb-6 text-gray-300">
          Откройте для себя тысячи товаров по лучшим ценам
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Перейти в каталог
        </Link>
      </section>
    </div>
  );
}