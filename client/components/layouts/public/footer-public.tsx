import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { getSiteSettings } from "@/lib/settings";

export default async function FooterPublic() {
  const { company, social } = await getSiteSettings();

  return (
    <footer className="w-full bg-muted border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-primary uppercase tracking-wide">
              {company.name}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <p>
                  {company.address}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <Link
                  href={`tel:${company.phoneRaw}`}
                  className="text-primary font-bold hover:underline"
                >
                  {company.phone}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <Link
                  href={`mailto:${company.email}`}
                  className="text-primary font-bold hover:underline"
                >
                  {company.email}
                </Link>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-primary uppercase tracking-wide">
              Liên kết mạng xã hội
            </h3>
            <div className="flex gap-3">
              <Link
                href={social.facebook}
                target="_blank"
                className="flex items-center justify-center w-10 h-10 rounded-md"
              >
                <Image
                  src="/assets/facebook-logo.png"
                  alt="Facebook"
                  width={30}
                  height={30}
                />
              </Link>
              <Link
                href={social.zalo}
                target="_blank"
                className="flex items-center justify-center w-10 h-10 rounded-md"
              >
                <Image
                  src="/assets/zalo-logo.png"
                  alt="Zalo"
                  width={30}
                  height={30}
                />
              </Link>
            </div>
          </div>

          {/* Consultation Info */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-primary uppercase tracking-wide">
              Thông tin tư vấn
            </h3>
            <p className="text-sm text-muted-foreground">
              Liên hệ để biết thêm thông tin
            </p>
            <Link
              href="/contact"
              className="text-sm font-bold text-primary hover:underline uppercase"
            >
              Liên hệ ngay
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-primary uppercase tracking-wide">
              Dịch vụ
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/prices"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Dịch vụ
              </Link>
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Dự án
              </Link>
              <Link
                href="/news"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Tin tức
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <p>
            Quân Bảo 2024&copy;. All rights reserved.
          </p>
          <Link
            href="/login"
            className="text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
          >
            Quản trị
          </Link>
        </div>
      </div>
    </footer>
  );
}
