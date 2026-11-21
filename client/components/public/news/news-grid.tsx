import type { News } from "@/types/api";
import NewsCard from "@/components/public/news-card";

export default function NewsGrid({ newsItems }: { newsItems: News[] }) {
  if (!newsItems.length) return null;
  return (
    <div className="mt-12 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {newsItems.map((article) => (
        <NewsCard key={article._id} article={article} />
      ))}
    </div>
  );
}
