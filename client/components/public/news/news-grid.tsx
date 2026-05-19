import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { News } from "@/types/api";
import { CmsImage } from "@/components/public/cms-image";

type NewsGridProps = {
  newsItems: News[];
};

export default function NewsGrid({ newsItems }: NewsGridProps) {
  const formatNewsDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {newsItems.map((item, index) => (
            <Card
              key={item._id || index}
              className="group relative overflow-hidden rounded-none border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 py-0"
            >
              <Link href={`/news/${item.slug}`} className="block">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <CmsImage
                    src={item.image}
                    alt={item.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-none bg-primary/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  <time>{formatNewsDate(item.date)}</time>
                </div>
                <Link href={`/news/${item.slug}`}>
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>
                <Link
                  href={`/news/${item.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  Đọc tiếp
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
