"use client";

import FeaturedNews from "./featured-news";
import NewsGrid from "./news-grid";
import { NewsFeaturedSkeleton, NewsGridSkeleton } from "@/components/ui/skeleton-news";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getNews } from "@/lib/api/news";
import { News } from "@/types/api";

function NewsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="w-full py-8 sm:pt-12 pb-0">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mb-6 sm:mb-8 flex flex-col items-center gap-2">
          <span className="inline-block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider section-header">
            TIN TỨC & BÀI VIẾT
          </span>
          <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Cập nhật các tin tức và bài viết mới nhất
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Chưa thể tải tin tức lúc này. Vui lòng thử lại sau.
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-none border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={onRetry}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function NewsLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [newsItems, setNewsItems] = useState<News[]>([]);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getNews({ limit: 7 });
      setNewsItems(data.news);
    } catch (error) {
      console.error("Failed to load public news list", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const data = await getNews({ limit: 7 });
        if (!isMounted) return;
        setNewsItems(data.news);
      } catch (error) {
        console.error("Failed to load public news list", error);
        if (!isMounted) return;
        setHasError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-full bg-background">
        <NewsFeaturedSkeleton />
        <NewsGridSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-full bg-background">
        <NewsErrorState onRetry={fetchNews} />
      </div>
    );
  }

  const [featured, ...gridItems] = newsItems;

  return (
    <div className="min-h-full bg-background">
      <FeaturedNews featured={featured ?? null} />
      <NewsGrid newsItems={gridItems} />
    </div>
  );
}
