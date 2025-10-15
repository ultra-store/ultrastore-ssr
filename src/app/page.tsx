import { HowToFindUs } from '@/components/how-to-find-us';
import { InfoBlock } from '@/components/info-block';
import { PopularCategories } from '@/components/popular-categories';
import { ProductLevel } from '@/components/products';
import { Reviews } from '@/components/reviews';
import { getHomepageData } from '@/shared/api/getHomepageData';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <PopularCategories items={data.popular_categories} />

      {!!data.new_products?.length && (
        <ProductLevel
          title="Новинки"
          items={data.new_products.map((p) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: `${p.price} ${p.currency || '₽'}`,
            link: p.link,
          }))}
          ctaHref="/catalog/new"
          ctaText="Все новинки"
        />
      )}

      {data.info_blocks?.[0] && (
        <InfoBlock {...data.info_blocks[0]} />
      )}

      {!!data.sale_products?.length && (
        <ProductLevel
          title="Скидки"
          items={data.sale_products.map((p) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: `${p.price} ${p.currency || '₽'}`,
            link: p.link,
          }))}
          ctaHref="/catalog/sale"
          ctaText="Все скидки"
        />
      )}

      {data.info_blocks?.[1] && (
        <InfoBlock {...data.info_blocks[1]} />
      )}

      {data.reviews?.length
        ? (
            <Reviews items={data.reviews} />
          )
        : null}

      <HowToFindUs />
    </>
  );
}
