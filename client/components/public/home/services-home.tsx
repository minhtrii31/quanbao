import Link from "next/link";
import { getPublicServices } from "@/lib/services";
import SectionHeading from "@/components/public/section-heading";

export default async function ServicesHome() {
  const services = await getPublicServices();
  return (
    <section className="section-space border-y border-border bg-muted/50">
      <div className="site-container">
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Phạm vi công việc"
          href="/prices"
          linkLabel="Xem chi tiết dịch vụ"
        />
        <div className="grid gap-x-14 md:grid-cols-2 lg:gap-x-20">
          {services.slice(0, 4).map((service, index) => (
            <article
              key={service.slug}
              className="flex gap-5 border-t border-border py-7 lg:gap-7 lg:py-9"
            >
              <span className="pt-1.5 font-mono text-xs text-primary">
                0{index + 1}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/prices/${service.slug}`}
                  className="hover:text-primary"
                >
                  <h3 className="mb-4 text-2xl font-medium tracking-tight">
                    {service.title}
                  </h3>
                </Link>
                <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
                  {service.includes.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link
                  href={`/prices/${service.slug}`}
                  className="mt-5 inline-block text-xs font-medium text-primary underline underline-offset-4"
                >
                  Chi tiết
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
