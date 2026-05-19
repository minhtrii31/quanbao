import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProjectCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden rounded-none border-0 bg-card shadow-sm py-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-5 sm:p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-9 w-full rounded-none" />
      </div>
    </Card>
  );
}

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mb-8 sm:mb-10 flex flex-col items-center gap-2 lg:gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 sm:w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}