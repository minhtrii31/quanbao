import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicServiceBySlug } from "@/lib/services";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    return {
      title: "Không tìm thấy dịch vụ",
    };
  }

  const title = service.seo?.title || `${service.title} | Dịch vụ Quân Bảo`;
  const description = service.seo?.description || service.description;
  const image = service.seo?.ogImage || service.image;

  return {
    title,
    description,
    alternates: {
      canonical: `/prices/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: service.title }],
      type: "article",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PriceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) notFound();

  const { company } = await getSiteSettings();

  return (
    <article className="min-h-full bg-background">
      <section className="relative min-h-[420px] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[420px] w-full max-w-7xl flex-col justify-end px-4 py-8 lg:px-6">
          <Button
            variant="secondary"
            asChild
            className="mb-8 w-fit rounded-none bg-background/95"
          >
            <Link href="/prices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại dịch vụ
            </Link>
          </Button>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white/80">
              Chi tiết dịch vụ
            </span>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
              {service.title}
            </h1>
            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              {service.detail || service.description}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-6">
          <div className="min-w-0 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Hạng mục bao gồm</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <div key={item} className="flex gap-3 border border-border p-4">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Quy trình thực hiện</h2>
              <div className="mt-4 space-y-3">
                {service.process.map((item, index) => (
                  <div key={item} className="flex gap-4 border-l-2 border-primary pl-4">
                    <span className="text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit border border-border bg-card p-5">
            <h2 className="text-lg font-bold text-foreground">Nhận báo giá chi tiết</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Giá thực tế phụ thuộc hiện trạng, vật tư và tiến độ. Quân Bảo sẽ
              khảo sát để lập báo giá rõ từng hạng mục.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button asChild className="rounded-none">
                <Link href={`tel:${company.phoneRaw}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi {company.phone}
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/contact">Gửi yêu cầu tư vấn</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}
