import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { NAVIGATION } from "@/lib/constants";

export default async function FooterPublic() {
  const { company, social } = await getSiteSettings();
  return (
    <footer className="border-t border-border bg-white">
      <div className="site-container">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.65fr_1.2fr] lg:gap-20 lg:py-18">
          <div>
            <Link href="/" aria-label="Quân Bảo — Trang chủ">
              <Image
                src="/assets/logo.png"
                alt="Quân Bảo"
                width={2001}
                height={761}
                sizes="200px"
                className="h-auto w-[190px] mix-blend-multiply"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
              Thiết kế, xây dựng và sửa chữa nhà ở, biệt thự, nhà xưởng tại TP.
              Hồ Chí Minh.
            </p>
            <div className="mt-6 flex gap-5 text-xs font-medium">
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                Facebook
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href={social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                Zalo
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest">
              Khám phá
            </h2>
            <div className="flex flex-col gap-4">
              {NAVIGATION.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest">
              Kết nối với Quân Bảo
            </h2>
            <address className="space-y-5 text-sm not-italic leading-7 text-muted-foreground">
              <p className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-primary" />
                {company.address}
              </p>
              <a
                href={`tel:${company.phoneRaw}`}
                className="flex items-center gap-3 font-semibold text-foreground hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 break-all hover:text-primary"
              >
                <Mail className="size-4 shrink-0 text-primary" />
                {company.email}
              </a>
            </address>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-border py-6 text-[11px] leading-6 text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. Bảo lưu mọi quyền.
          </p>
          <Link href="/login" className="shrink-0 hover:text-primary">
            Quản trị website
            <ArrowUpRight className="ml-1 inline size-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
