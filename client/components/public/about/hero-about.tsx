import Image from "next/image";
import Link from "next/link";
import { AboutContent } from "@/lib/page-content";

export default function HeroAbout({ content }: { content: AboutContent["hero"] }) {
  return (
    <section className="relative w-full bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-8 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight text-center">
              {content.title}
              <span className="block text-primary">{content.highlight}</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed text-center w-full">
              {content.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-none bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                Liên hệ ngay
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-none border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all duration-300"
              >
                Xem dự án
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 blur-2xl" />
            <div className="relative aspect-[4/3] overflow-hidden shadow-2xl shadow-primary/10">
              <Image
                src={content.image}
                alt="Quân Bảo Construction"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
