import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export default async function ContactBanner() {
  const { company } = await getSiteSettings();
  return (
    <section className="border-t border-primary/15 bg-[#fff7ef]">
      <div className="site-container flex flex-col justify-between gap-7 py-12 lg:flex-row lg:items-center lg:py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Bạn cần xây mới hoặc sửa chữa?
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Gửi nhu cầu để Quân Bảo trao đổi về phạm vi công việc và phương án
            thực hiện.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-5 lg:flex-col lg:items-start lg:gap-3">
          <Link href="/contact" className="brand-button">
            Liên hệ tư vấn
          </Link>
          <a
            href={`tel:${company.phoneRaw}`}
            className="text-sm font-medium hover:text-primary"
          >
            {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
