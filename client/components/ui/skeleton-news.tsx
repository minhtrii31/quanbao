import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function NewsCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden rounded-none border-0 bg-card shadow-sm py-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </Card>
  );
}

export function NewsFeaturedSkeleton() {
  return (
    <section className="w-full py-8 sm:pt-12 pb-0">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-4 w-32 mx-auto mb-2" />
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>

        <Card className="flex h-full flex-col overflow-hidden rounded-none border-0 bg-card py-0 shadow-none ring-0 gap-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Skeleton className="relative aspect-[16/11] w-full" />
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="w-full py-8">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}