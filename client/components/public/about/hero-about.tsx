import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { AboutContent } from "@/lib/page-content";

export default function HeroAbout({
  content,
}: {
  content: AboutContent["hero"];
}) {
  return (
    <section className="border-b border-border bg-muted/50">
      <div className="site-container py-10 lg:py-14">
        <div className="mb-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="size-3" />
          <span>Giới thiệu</span>
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="py-2 lg:py-10">
            <h1 className="section-title">
              Công ty xây dựng
              <br />
              <span className="text-primary">Quân Bảo</span>
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              {content.description}
            </p>
            <Link href="/contact" className="brand-button mt-8">
              Liên hệ doanh nghiệp
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div>
            <div className="image-frame aspect-[5/4]">
              <Image
                src={content.image}
                alt="Không gian kiến trúc — cảm hứng xây dựng Quân Bảo"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Kiến trúc nhà ở · Hình ảnh tham khảo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
