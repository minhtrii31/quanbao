"use client";

import { useNews } from "@/hooks/use-news";
import FeaturedNews from "./featured-news";
import NewsGrid from "./news-grid";
import CollectionState, {
  CollectionSkeleton,
} from "@/components/public/collection-state";

export default function NewsLayout() {
  const { news, loading, error, refetch } = useNews({ limit: 7 });
  const [featured, ...gridItems] = news;
  return (
    <section className="section-space">
      <div className="site-container">
        {loading ? (
          <CollectionSkeleton />
        ) : error ? (
          <CollectionState
            message="Chưa thể tải tin tức lúc này. Vui lòng thử lại sau."
            onRetry={refetch}
          />
        ) : !featured ? (
          <CollectionState message="Chưa có tin tức nào." />
        ) : (
          <>
            <FeaturedNews featured={featured} />
            <NewsGrid newsItems={gridItems} />
          </>
        )}
      </div>
    </section>
  );
}
