import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/lib/page-content";

export default function OverviewHome({
  content,
}: {
  content: HomeContent["overview"];
}) {
  return (
    <section className="section-space">
      <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="image-frame aspect-[5/4]">
            <Image
              src="/assets/home/1.avif"
              alt="Không gian nội thất với thiết kế mở và ánh sáng tự nhiên"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Không gian nội thất · Hình ảnh tham khảo
          </p>
        </div>
        <div>
          <h2 className="section-title">Nhà thầu xây dựng Quân Bảo.</h2>
          <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
            {content.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-7 divide-y divide-border border-y border-border text-sm">
            <div className="grid grid-cols-[100px_1fr] gap-4 py-4">
              <dt className="text-muted-foreground">Dân dụng</dt>
              <dd>Nhà phố, biệt thự, sửa chữa nhà ở</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-4 py-4">
              <dt className="text-muted-foreground">Công nghiệp</dt>
              <dd>Thi công phần thô, nhà xưởng</dd>
            </div>
          </dl>
          <Link
            href="/about"
            className="mt-7 inline-block text-sm font-medium text-primary underline underline-offset-8"
          >
            Thông tin doanh nghiệp
          </Link>
        </div>
      </div>
    </section>
  );
}
