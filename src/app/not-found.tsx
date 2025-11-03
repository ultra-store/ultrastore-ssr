import Link from 'next/link';

import { ProductLevel } from '@/components/products/product-level/product-level';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';

import { getHomepageData } from '@/shared/api/getHomepageData';
import type { Product } from '@/shared/types/types';

const containerStyle = {
  textAlign: 'center' as const,
  padding: 'var(--spacing-4xl) 0',
};

const headingStyle = { marginBottom: 'var(--spacing-2xl)' };

const buttonWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
};

export default async function NotFound() {
  // Получаем базовую подборку товаров
  let products: Product[] = [];

  try {
    const homepageData = await getHomepageData();

    // Используем новинки, если есть, иначе скидки
    if (homepageData.new_products && homepageData.new_products.length > 0) {
      products = homepageData.new_products.slice(0, 4);
    } else if (homepageData.sale_products && homepageData.sale_products.length > 0) {
      products = homepageData.sale_products.slice(0, 4);
    }
  } catch {
    // Если не удалось загрузить товары, просто не показываем их
    products = [];
  }

  return (
    <>
      <Section ariaLabel="Страница не найдена">
        <div style={containerStyle}>
          <h1 className="heading-1" style={headingStyle}>
            Ой, страница не найдена! 😔
          </h1>
          <div style={buttonWrapperStyle}>
            <Link href="/">
              <Button variant="primary">
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {products.length > 0 && (
        <ProductLevel
          title="Возможно, вам будет интересно"
          items={products}
          showPricePrefix
          ctaText="Смотреть все товары"
          ctaHref="/catalog"
        />
      )}
    </>
  );
}
