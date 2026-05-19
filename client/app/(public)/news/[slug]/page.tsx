import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getNewsBySlug } from "@/lib/api/news";
import { ContentRenderer } from "@/components/editor/ContentRenderer";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/public/cms-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug).catch(() => null);

  if (!news) {
    return {
      title: "Không tìm thấy tin tức",
    };
  }

  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: [{ url: news.image, alt: news.title }],
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug).catch(() => null);

  if (!news) notFound();

  return (
    <article className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12 lg:px-6">
        <Button variant="ghost" asChild className="rounded-none mb-6">
          <Link href="/news" className="underline underline-offset-4">
            Quay lại tin tức
          </Link>
        </Button>
        <div className="min-w-0 space-y-4">
          <span className="inline-flex max-w-full rounded-none bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            {news.category}
          </span>
          <h1 className="break-words text-2xl font-bold leading-tight text-foreground sm:text-4xl">
            {news.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            <time>{new Date(news.date).toLocaleDateString("vi-VN")}</time>
          </div>
          <p className="break-words text-base text-muted-foreground">
            {news.excerpt}
          </p>
        </div>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden">
          <CmsImage
            src={news.image}
            alt={news.title}
            className="object-cover"
          />
        </div>

        <ContentRenderer content={news.content} className="mt-8" />
      </div>
    </article>
  );
}
