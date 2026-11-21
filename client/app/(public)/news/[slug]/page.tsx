import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getNewsBySlug } from "@/lib/api/news";
import { ContentRenderer } from "@/components/editor/ContentRenderer";
import { ArrowLeft } from "lucide-react";
import ContactBanner from "@/components/public/contact-banner";
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
      <div className="mx-auto w-full max-w-[1000px] px-5 py-10 sm:px-8 sm:py-16 lg:px-12">
        <div className="mb-9">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại tin tức
          </Link>
        </div>
        <div className="min-w-0 space-y-4">
          <span className="inline-flex max-w-full rounded-none bg-primary/8 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
            {news.category}
          </span>
          <h1 className="break-words text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            {news.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            <time dateTime={news.date}>
              {new Date(news.date).toLocaleDateString("vi-VN")}
            </time>
          </div>
          <p className="break-words text-base text-muted-foreground">
            {news.excerpt}
          </p>
        </div>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden">
          <CmsImage
            src={news.image}
            alt={news.title}
            className="object-cover"
          />
        </div>

        <ContentRenderer
          content={news.content}
          className="mt-10 text-base leading-8"
        />
      </div>
      <ContactBanner />
    </article>
  );
}
