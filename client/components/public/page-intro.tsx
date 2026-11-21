import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border bg-muted/45">
      <div className="site-container py-9 sm:py-12 lg:py-14">
        <div className="mb-7 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="size-3" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
