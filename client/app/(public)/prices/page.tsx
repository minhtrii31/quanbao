import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { getPublicServices } from "@/lib/services";
import PageIntro from "@/components/public/page-intro";
import ContactBanner from "@/components/public/contact-banner";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dịch vụ Quân Bảo",
  description:
    "Các dịch vụ xây dựng, sửa chữa và thiết kế thi công của Quân Bảo.",
  alternates: { canonical: "/prices" },
};

export default async function PricesPage() {
  const services = await getPublicServices();
  return (
    <>
      <PageIntro
        eyebrow="Dịch vụ"
        title="Dịch vụ xây dựng"
        description="Các hạng mục thiết kế, xây mới và sửa chữa. Phạm vi cụ thể được xác định sau khi trao đổi nhu cầu và khảo sát công trình."
      />
      <section className="section-space">
        <div className="site-container grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
          {services.map((service, index) => (
            <article key={service.slug} className="group flex min-w-0 flex-col">
              <Link
                href={`/prices/${service.slug}`}
                className="image-frame block aspect-[16/10]"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                />
                <span className="absolute left-5 top-5 flex size-11 items-center justify-center bg-white font-mono text-sm text-primary">
                  0{index + 1}
                </span>
              </Link>
              <div className="flex flex-1 flex-col border-b border-border py-7">
                <Link href={`/prices/${service.slug}`}>
                  <h2 className="text-2xl font-medium tracking-tight transition-colors hover:text-primary">
                    {service.title}
                  </h2>
                </Link>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {service.description}
                </p>
                <ul className="my-5 grid gap-x-4 gap-y-3 sm:grid-cols-2">
                  {service.features.slice(0, 4).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs leading-6"
                    >
                      <Check className="mt-1 size-3.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/prices/${service.slug}`}
                  className="text-link mt-auto pt-2"
                >
                  Chi tiết dịch vụ
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
