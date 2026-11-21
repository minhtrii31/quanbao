import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-4 text-xs font-medium text-primary">{eyebrow}</p>
        )}
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link href={href} className="text-link shrink-0">
          {linkLabel || "Khám phá thêm"}
        </Link>
      )}
    </div>
  );
}
