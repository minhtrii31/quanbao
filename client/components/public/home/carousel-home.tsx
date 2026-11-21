"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CarouselHome({ images }: { images: string[] }) {
  const slides = images.length ? images : ["/assets/home/3.avif"];
  const [selected, setSelected] = useState(0);
  const current = selected % slides.length;
  const select = (direction: number) =>
    setSelected((value) => (value + direction + slides.length) % slides.length);

  return (
    <section
      aria-label="Giới thiệu Quân Bảo"
      className="border-b border-border bg-white"
    >
      <div className="site-container grid gap-8 py-8 lg:min-h-[650px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-10">
        <div className="flex flex-col justify-center py-5 sm:py-10 lg:py-12">
          <p className="mb-7 text-xs font-medium text-primary">
            CÔNG TY XÂY DỰNG QUÂN BẢO
          </p>
          <h1 className="display-title">
            Xây dựng
            <br />& cải tạo
            <br />
            <span className="text-primary">công trình.</span>
          </h1>
          <p className="mt-7 max-w-[420px] text-base leading-8 text-muted-foreground">
            Xây nhà trọn gói, thi công phần thô, thiết kế và sửa chữa nhà ở,
            biệt thự, nhà xưởng.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href="/contact" className="brand-button">
              Yêu cầu tư vấn
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/prices"
              className="text-sm font-medium underline decoration-border underline-offset-8 hover:text-primary"
            >
              Các dịch vụ
            </Link>
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="image-frame aspect-[5/4] lg:min-h-[540px] lg:flex-1 lg:aspect-auto">
            <Image
              src={slides[current]}
              alt={`Không gian kiến trúc và nội thất — ảnh ${current + 1}`}
              fill
              priority={current === 0}
              unoptimized={slides[current].startsWith("/assets/")}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
            <span className="text-[11px] text-muted-foreground">
              Hình ảnh tham khảo
            </span>
            <div className="flex items-center gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Chuyển đến ảnh ${index + 1}`}
                  aria-pressed={current === index}
                  onClick={() => setSelected(index)}
                  className="flex size-7 items-center justify-center"
                >
                  <span
                    className={`block size-1.5 rounded-full ${current === index ? "bg-primary" : "bg-border"}`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Ảnh trước"
                onClick={() => select(-1)}
                disabled={slides.length < 2}
                className="flex size-10 items-center justify-center border border-border transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Ảnh tiếp theo"
                onClick={() => select(1)}
                disabled={slides.length < 2}
                className="flex size-10 items-center justify-center border border-border transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
