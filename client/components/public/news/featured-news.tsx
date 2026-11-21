import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { News } from "@/types/api";
import { CmsImage } from "@/components/public/cms-image";

export default function FeaturedNews({ featured }: { featured: News | null }) {
  if (!featured) return null;
  return (
    <Link
      href={`/news/${featured.slug}`}
      className="group grid overflow-hidden border border-border bg-muted/50 lg:grid-cols-2"
    >
      <div className="image-frame aspect-[4/3] lg:aspect-auto lg:min-h-96">
        <CmsImage
          src={featured.image}
          alt={featured.title}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <span className="eyebrow mb-6">Bài viết nổi bật</span>
        <div className="mb-5 flex items-center gap-3 text-[11px]">
          <span className="font-medium text-primary">{featured.category}</span>
          <span className="size-1 rounded-full bg-border" />
          <time dateTime={featured.date} className="text-muted-foreground">
            {new Date(featured.date).toLocaleDateString("vi-VN")}
          </time>
        </div>
        <h2 className="text-2xl font-medium leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
          {featured.title}
        </h2>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          {featured.excerpt}
        </p>
        <span className="text-link mt-7">
          Đọc bài viết
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
