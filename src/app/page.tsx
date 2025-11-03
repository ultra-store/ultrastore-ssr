import { HowToFindUs } from '@/components/how-to-find-us';
import { InfoBlock } from '@/components/info-block';
import { PopularCategories } from '@/components/popular-categories';
import { ProductLevel } from '@/components/products/product-level/product-level';
import { PromoBanners } from '@/components/promo-banners';
import { Reviews } from '@/components/reviews';
import { getHomepageData } from '@/shared/api/getHomepageData';
import { getLayoutData } from '@/shared/api/getLayoutData';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
// Or set revalidate time (in seconds)
// export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const {
    popular_categories,
    info_blocks,
    reviews,
    new_products,
    sale_products,
    promo_banners,
  } = await getHomepageData();

  const { contacts, social } = await getLayoutData('front-page');

  const [firstInfoBlock, secondInfoBlock] = info_blocks || [];

  return (
    <>
      <PromoBanners items={promo_banners} />
      <PopularCategories items={popular_categories} />
      <ProductLevel title="Новинки" items={new_products} showPricePrefix />
      <InfoBlock {...firstInfoBlock} />
      <ProductLevel title="Скидки" items={sale_products} showPricePrefix />
      <InfoBlock {...secondInfoBlock} />
      <Reviews items={reviews} />
      <HowToFindUs contacts={contacts} socials={social} />
    </>
  );
}
