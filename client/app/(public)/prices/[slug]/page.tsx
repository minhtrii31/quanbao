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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="site-container relative flex min-h-[480px] flex-col justify-end py-10 lg:py-14">
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
            <h1 className="text-4xl font-medium leading-tight tracking-tight text-white sm:text-6xl">
              {service.title}
            </h1>
            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              {service.detail || service.description}
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="min-w-0 space-y-8">
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-foreground">
                Hạng mục bao gồm
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 border border-border bg-muted/30 p-5"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-medium tracking-tight text-foreground">
                Quy trình thực hiện
              </h2>
              <div className="mt-4 space-y-3">
                {service.process.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 border-b border-border py-5"
                  >
                    <span className="text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit border-t-[3px] border-primary bg-[#fff7ef] p-7 lg:sticky lg:top-40">
            <h2 className="text-lg font-bold text-foreground">
              Nhận báo giá chi tiết
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Giá thực tế phụ thuộc hiện trạng, vật tư và tiến độ. Quân Bảo sẽ
              khảo sát để lập báo giá rõ từng hạng mục.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button asChild className="h-11 rounded-sm">
                <Link href={`tel:${company.phoneRaw}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi {company.phone}
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-sm">
                <Link href="/contact">Gửi yêu cầu tư vấn</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}
