import HeroAbout from "@/components/public/about/hero-about";
import ProcessHome from "@/components/public/home/process-home";
import ContactBanner from "@/components/public/contact-banner";
import { getAboutContent } from "@/lib/page-content";
import { getSiteSettings } from "@/lib/settings";

export default async function AboutPage() {
  const [content, { company }] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
  ]);
  const details = [
    { label: "Tên doanh nghiệp", value: company.name },
    { label: "Địa chỉ", value: company.address },
    {
      label: "Điện thoại",
      value: company.phone,
      href: `tel:${company.phoneRaw}`,
    },
    { label: "Email", value: company.email, href: `mailto:${company.email}` },
    { label: "Giờ làm việc", value: company.workingHours },
  ];
  return (
    <>
      <HeroAbout content={content.hero} />
      <section className="section-space">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="section-title">Thông tin doanh nghiệp</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Thông tin liên hệ và thời gian tiếp nhận tư vấn của Quân Bảo.
            </p>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="grid gap-2 py-5 text-sm sm:grid-cols-[145px_1fr] sm:gap-5"
              >
                <dt className="text-muted-foreground">{detail.label}</dt>
                <dd className="min-w-0 break-words leading-7">
                  {detail.href ? (
                    <a href={detail.href} className="hover:text-primary">
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <ProcessHome />
      <ContactBanner />
    </>
  );
}
