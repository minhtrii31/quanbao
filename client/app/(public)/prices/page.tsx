import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/settings";
import { getPublicServices } from "@/lib/services";
import {
  Wrench,
  Home,
  PencilRuler,
  Building2,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dịch vụ Quân Bảo",
  description: "Các dịch vụ xây dựng, sửa chữa và thiết kế thi công của Quân Bảo.",
  alternates: {
    canonical: "/prices",
  },
};

const serviceIcons = {
  wrench: Wrench,
  home: Home,
  "pencil-ruler": PencilRuler,
  building: Building2,
} as const;

export default async function PricesPage() {
  const { company } = await getSiteSettings();
  const services = await getPublicServices();

  return (
    <div className="min-h-full bg-background">
      {/* Services Grid */}
      <section className="w-full py-8 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          <div className="mb-8 sm:mb-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider section-header">
              DỊCH VỤ
            </span>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-3">
              Chọn dịch vụ phù hợp với nhu cầu xây dựng, sửa chữa và hoàn thiện
              công trình của bạn.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = serviceIcons[(service as typeof service & { icon?: keyof typeof serviceIcons }).icon || "wrench"];
              return (
                <div
                  key={index}
                  className="group relative border border-border bg-card p-0 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Image */}
                    <div className="relative w-full lg:w-1/2 aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                          {service.description}
                        </p>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {service.features.slice(0, 5).map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-sm text-foreground"
                            >
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-auto pt-4 sm:pt-6">
                        <Button
                          asChild
                          className="w-full lg:w-auto rounded-none"
                        >
                          <Link href={`/prices/${service.slug}`}>
                            Xem chi tiết dịch vụ
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary py-10 sm:py-12 lg:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 text-center space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            CẦN TƯ VẤN DỊCH VỤ?
          </h2>
          <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận phương án
            phù hợp nhất cho công trình của bạn.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 pt-2">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="inline-flex items-center gap-2 rounded-none border border-border bg-background px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all duration-300"
            >
              <Link href={`tel:${company.phoneRaw}`}>Gọi ngay</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="inline-flex items-center gap-2 rounded-none border border-border bg-background px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all duration-300"
            >
              <Link href="/contact">Nhắn tin</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
