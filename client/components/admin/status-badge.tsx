import { cn } from "@/lib/utils";

const statusStyles: Record<string, { label: string; className: string }> = {
  published: {
    label: "Đã đăng",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  draft: {
    label: "Nháp",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  new: {
    label: "Mới",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  read: {
    label: "Đã đọc",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  replied: {
    label: "Đã trả lời",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  missingAlt: {
    label: "Thiếu alt",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  hasAlt: {
    label: "Có alt",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const config = statusStyles[status] ?? {
    label: label ?? status,
    className: "border-border bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-xs font-medium leading-5",
        config.className,
        className,
      )}
    >
      {label ?? config.label}
    </span>
  );
}
