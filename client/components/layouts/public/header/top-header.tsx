import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export default async function TopHeader() {
  const { company } = await getSiteSettings();

  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-3 bg-background px-4 py-3 lg:flex-row lg:justify-between lg:gap-4 lg:px-8">
      {/* Logo Section */}
      <div className="shrink-0">
        <Link href={"/"}>
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={250}
            height={120}
            priority
            className="w-48 lg:w-64 h-auto object-contain"
          />
        </Link>
      </div>

      {/* Tagline + Phone Section */}
      <div className="flex min-w-0 flex-col items-center gap-2 lg:items-start">
        <h2 className="max-w-full text-center text-base font-bold leading-tight text-primary sm:text-lg lg:text-left">
          {company.tagline}
        </h2>
        <div className="w-full max-w-full text-center text-sm leading-relaxed text-muted-foreground lg:min-h-[45.5px] lg:text-left">
          <p>
            Số điện thoại liên hệ{" "}
            <Link
              href={`tel:${company.phoneRaw}`}
              className="text-primary font-bold hover:underline"
            >
              {company.phone}
            </Link>
          </p>
        </div>
      </div>

      {/* Company + Address Section */}
      <div className="hidden min-w-0 max-w-sm flex-col items-start gap-2 lg:flex">
        <h2 className="break-words text-base font-bold leading-tight text-primary lg:text-lg">
          {company.name}
        </h2>
        <p className="max-w-xs break-words text-xs leading-relaxed text-muted-foreground lg:max-w-sm lg:text-sm">
          {company.address}
        </p>
      </div>
    </div>
  );
}
