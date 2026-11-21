"use client";

import { useNews } from "@/hooks/use-news";
import SectionHeading from "@/components/public/section-heading";
import NewsCard from "@/components/public/news-card";
import CollectionState, {
  CollectionSkeleton,
} from "@/components/public/collection-state";

export default function LatestNewsHome() {
  const { news, loading, error, refetch } = useNews({ limit: 3 });
  return (
    <section className="section-space border-t border-border bg-muted/60">
      <div className="site-container">
        <SectionHeading
          title="Tin tức và bài viết"
          description="Thông tin công ty và kiến thức xây dựng."
          href="/news"
          linkLabel="Tất cả bài viết"
        />
        {loading ? (
          <CollectionSkeleton />
        ) : error ? (
          <CollectionState
            message="Chưa thể tải tin tức. Vui lòng thử lại."
            onRetry={refetch}
          />
        ) : news.length === 0 ? (
          <CollectionState message="Các bài viết mới sẽ được cập nhật tại đây." />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
