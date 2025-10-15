import { InfoBlock } from '@/components/info-block';
import { PopularCategories } from '@/components/popular-categories';
import { getHomepageData } from '@/shared/api/getHomepageData';
import { Reviews } from '@/components/reviews';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <div>
      <PopularCategories items={data.popular_categories} />
      {data.info_blocks?.[0] && (
        <InfoBlock {...data.info_blocks[0]} />
      )}

      {data.info_blocks?.[1] && (
        <InfoBlock {...data.info_blocks[1]} />
      )}

      {data.reviews?.length ? (
        <Reviews items={data.reviews} />
      ) : null}
    </div>
  );
}
