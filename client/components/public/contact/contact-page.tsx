import { MapPin, Phone, Mail, Clock3, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import PageIntro from "@/components/public/page-intro";
import ContactForm from "./contact-form";

export default async function ContactContent() {
  const { company } = await getSiteSettings();
  const contactInfo = [
    { icon: MapPin, label: "Ghé thăm văn phòng", value: company.address },
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
    { icon: Clock3, label: "Thời gian làm việc", value: company.workingHours },
  ];
  return (
    <>
      <PageIntro
        eyebrow="Liên hệ"
        title="Liên hệ Quân Bảo"
        description="Gửi yêu cầu tư vấn, đặt lịch khảo sát hoặc trao đổi về hạng mục bạn cần thực hiện."
      />
      <section className="section-space">
        <div className="site-container grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">
              Thông tin liên hệ
            </h2>
            <div className="mt-8">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex gap-4 border-b border-border py-5"
                >
                  <info.icon className="mt-1 size-5 shrink-0 stroke-[1.5] text-primary" />
                  <div className="min-w-0">
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="break-words text-sm font-medium leading-7 hover:text-primary"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm leading-7">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/prices" className="text-link mt-6">
              Tìm hiểu các dịch vụ
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
