"use client";

import { RotateCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CollectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Đang tải nội dung"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <Skeleton className="mt-5 h-5 w-3/4" />
          <Skeleton className="mt-3 h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function CollectionState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-start justify-between gap-4 border-y border-border py-7 text-sm leading-7 text-muted-foreground sm:flex-row sm:items-center"
      role="status"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 items-center gap-2 border-b border-primary pb-1 text-xs font-medium text-primary"
        >
          <RotateCw className="size-3.5" />
          Thử lại
        </button>
      )}
    </div>
  );
}
