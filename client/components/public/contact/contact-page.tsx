import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/settings";
import ContactForm from "./contact-form";

export default async function ContactContent() {
  const { company } = await getSiteSettings();
  const contactInfo = [
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: company.address,
    },
    {
      icon: Phone,
      label: "Điện thoại",
      value: company.phone,
      href: `tel:${company.phoneRaw}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: company.email,
      href: `mailto:${company.email}`,
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: company.workingHours,
    },
  ];

  return (
    <div className="min-h-full bg-background">
      <section className="w-full py-8 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          <div className="mb-8 sm:mb-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider section-header">
              Liên hệ
            </span>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-3">
              Liên hệ ngay để được tư vấn miễn phí và nhận báo giá chi tiết nhất
              cho công trình của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-none border border-border bg-card"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm text-primary hover:underline"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-none bg-primary px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                  <Link href={`tel:${company.phoneRaw}`}>Gọi ngay</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-none border border-border bg-background px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all duration-300"
                >
                  <Link href="/prices">Xem dịch vụ</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <ContactForm />

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop&q=60"
                  alt="Liên hệ Quân Bảo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
