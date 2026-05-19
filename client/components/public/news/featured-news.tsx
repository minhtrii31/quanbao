import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { News } from "@/types/api";
import { CmsImage } from "@/components/public/cms-image";

type FeaturedNewsProps = {
  featured: News | null;
};

export default function FeaturedNews({ featured }: FeaturedNewsProps) {
  const formatNewsDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (!featured) {
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
          <div className="text-center py-8 text-muted-foreground">
            Chưa có tin tức nào.
          </div>
        </div>
      </section>
    );
  }

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

        <Link
          href={`/news/${featured.slug}`}
          className="group block relative overflow-hidden rounded-none border-0 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[16/11] lg:aspect-auto w-full overflow-hidden">
              <CmsImage
                src={featured.image}
                alt={featured.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-none bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                  {featured.category}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                <time>{formatNewsDate(featured.date)}</time>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {featured.excerpt}
              </p>

              <span className="inline-flex items-center text-sm font-semibold text-primary">
                Đọc tiếp
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
