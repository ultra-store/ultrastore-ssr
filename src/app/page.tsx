// import { HowToFindUs } from '@/components/how-to-find-us';
// import { InfoBlock } from '@/components/info-block';
import { PopularCategories } from '@/components/popular-categories';
// import { ProductLevel } from '@/components/products';
// import { PromoBanners } from '@/components/promo-banners';
// import { Reviews } from '@/components/reviews';
import { getHomepageData } from '@/shared/api/getHomepageData';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <PopularCategories items={data.popular_categories} />
    </>
  );
}
