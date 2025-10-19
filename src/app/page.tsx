// import { HowToFindUs } from '@/components/how-to-find-us';
// import { InfoBlock } from '@/components/info-block';
import { InfoBlock } from '@/components/info-block';
import { PopularCategories } from '@/components/popular-categories';
// import { ProductLevel } from '@/components/products';
// import { PromoBanners } from '@/components/promo-banners';
import { Reviews } from '@/components/reviews';
import { getHomepageData } from '@/shared/api/getHomepageData';

export default async function HomePage() {
  const { popular_categories, info_blocks, reviews } = await getHomepageData();

  const [firstInfoBlock, secondInfoBlock] = info_blocks || [];

  return (
    <>
      <PopularCategories items={popular_categories} />
      <InfoBlock {...firstInfoBlock} />
      <InfoBlock {...secondInfoBlock} />
      <Reviews items={reviews} />
    </>
  );
}
