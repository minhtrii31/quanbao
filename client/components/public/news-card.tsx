import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CmsImage } from "@/components/public/cms-image";
import type { News } from "@/types/api";

export default function NewsCard({ article }: { article: News }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block min-w-0">
      <div className="image-frame aspect-[16/10]">
        <CmsImage
          src={article.image}
          alt={article.title}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
      </div>
      <div className="pt-5">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider">
          <span className="font-semibold text-primary">{article.category}</span>
          <span className="h-3 w-px bg-border" />
          <time dateTime={article.date} className="text-muted-foreground">
            {new Date(article.date).toLocaleDateString("vi-VN")}
          </time>
        </div>
        <h3 className="line-clamp-2 text-xl font-medium leading-snug tracking-tight group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">
          {article.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-3 text-xs font-semibold">
          Đọc bài viết
          <ArrowUpRight className="size-4 text-primary" />
        </span>
      </div>
    </Link>
  );
}
