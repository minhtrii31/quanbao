"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNews } from "@/hooks/use-news";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonText } from "@/components/ui/skeleton-text";
import { CmsImage } from "@/components/public/cms-image";

const formatNewsDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function LatestNewsHome() {
  const { news: latestNews, loading, error } = useNews({ limit: 6 });

  // Show loading state
  if (loading) {
    return (
      <section className="w-full bg-background">
        <div className="mx-auto w-full max-w-7xl px-0 lg:px-6">
          <div className="mb-4 flex flex-col items-center gap-1.5 lg:mb-5">
            <div className="section-header">
              <h2>TIN TỨC MỚI NHẤT</h2>
            </div>
            <p className="max-w-2xl text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Cập nhật các thông tin xây dựng, thiết kế và giải pháp thi công mới
              nhất từ Quân Bảo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:gap-6 lg:grid-cols-2 lg:items-stretch">
            {/* Featured News Skeleton */}
            <Card className="flex h-full flex-col overflow-hidden rounded-none border-0 bg-card py-0 shadow-none ring-0 gap-0">
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="space-y-1.5 py-3 sm:py-3.5">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4 mt-1" />
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonText className="h-4 w-2/3" />
                </p>
              </div>
            </Card>

            {/* Secondary News Skeleton */}
            <Card className="flex h-full flex-col overflow-hidden rounded-none border-0 bg-card py-0 shadow-none ring-0">
              <div className="flex min-h-0 flex-1 flex-col divide-y divide-border/60 lg:overflow-hidden">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-0 flex-1 flex-col justify-center px-0 py-2 lg:px-3 lg:py-0"
                  >
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Skeleton className="h-3.5 w-3.5" />
                      <Skeleton className="h-3.5 w-16" />
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <SkeletonText className="h-4 w-full" />
                      <SkeletonText className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full bg-background">
        <div className="mx-auto w-full max-w-7xl px-0 lg:px-6">
          <div className="mb-4 flex flex-col items-center gap-1.5 lg:mb-5">
            <div className="section-header">
              <h2>TIN TỨC MỚI NHẤT</h2>
            </div>
            <p className="max-w-2xl text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Cập nhật các thông tin xây dựng, thiết kế và giải pháp thi công mới
              nhất từ Quân Bảo.
            </p>
          </div>
          <div className="text-center py-8 text-red-600">
            Đã xảy ra lỗi khi tải tin tức. Vui lòng thử lại sau.
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!latestNews || latestNews.length === 0) {
    return (
      <section className="w-full bg-background">
        <div className="mx-auto w-full max-w-7xl px-0 lg:px-6">
          <div className="mb-4 flex flex-col items-center gap-1.5 lg:mb-5">
            <div className="section-header">
              <h2>TIN TỨC MỚI NHẤT</h2>
            </div>
            <p className="max-w-2xl text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Cập nhật các thông tin xây dựng, thiết kế và giải pháp thi công mới
              nhất từ Quân Bảo.
            </p>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            Chưa có tin tức nào.
          </div>
        </div>
      </section>
    );
  }

  const featuredNews = latestNews[0];
  const secondaryNews = latestNews.slice(1);

  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-0 lg:px-6">
        <div className="mb-4 flex flex-col items-center gap-1.5 lg:mb-5">
          <div className="section-header">
            <h2>TIN TỨC MỚI NHẤT</h2>
          </div>
          <p className="max-w-2xl text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Cập nhật các thông tin xây dựng, thiết kế và giải pháp thi công mới
            nhất từ Quân Bảo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:gap-6 lg:grid-cols-2 lg:items-stretch">
          <Card className="flex h-full flex-col overflow-hidden rounded-none border-0 bg-card py-0 shadow-none ring-0 gap-0">
            <Link
              href={`/news/${featuredNews.slug}`}
              className="group flex h-full flex-col"
              aria-label={featuredNews.title}
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <CmsImage
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5 py-3 sm:py-3.5">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <time dateTime={featuredNews.date}>
                    {formatNewsDate(featuredNews.date)}
                  </time>
                </div>

                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary lg:text-[15px]">
                  {featuredNews.title}
                </h3>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {featuredNews.excerpt}
                </p>
              </div>
            </Link>
          </Card>

          <Card className="flex h-full flex-col overflow-hidden rounded-none border-0 bg-card py-0 shadow-none ring-0">
            <div className="flex min-h-0 flex-1 flex-col divide-y divide-border/60 lg:overflow-hidden">
              {secondaryNews.map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item.slug}`}
                  className="group flex min-h-0 flex-1 flex-col justify-center px-0 py-2 transition-colors duration-200 hover:bg-muted/30 lg:px-3 lg:py-0"
                  aria-label={item.title}
                >
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    <time dateTime={item.date}>
                      {formatNewsDate(item.date)}
                    </time>
                  </div>

                  <h3 className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm lg:line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground sm:line-clamp-2 lg:line-clamp-1">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
