"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { CmsImage } from "@/components/public/cms-image";

export default function LatestProjectHome() {
  const { projects, loading, error } = useProjects();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const luxuryNavButtonClassName =
    "h-10 w-10 rounded-full bg-primary/60 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground font-bold text-primary-foreground cursor-pointer";

  const mobileNavButtonClassName =
    "h-12 w-12 rounded-full bg-primary/60 backdrop-blur-xl hover:bg-primary hover:text-primary-foreground font-bold text-primary-foreground cursor-pointer";

  const handlePrev = () => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
  };

  const handleNext = () => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
  };

  useEffect(() => {
    if (!carouselApi) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselApi, isPaused]);

  // Show loading state
  if (loading) {
    return (
      <section className="w-full bg-background">
        <div className="mx-auto w-full max-w-7xl p-0 lg:px-6">
          <div className="mb-6 flex flex-col items-center gap-2 lg:mb-8">
            <div className="section-header">
              <h2>DỰ ÁN GẦN ĐÂY</h2>
            </div>
            <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground lg:text-base">
              Khám phá những công trình tiêu biểu mà Quân Bảo đã triển khai với
              tiêu chuẩn thi công cao, tiến độ rõ ràng và chất lượng hoàn thiện
              đồng bộ.
            </p>
          </div>

          <div className="relative">
            <Carousel
              setApi={(api) => {
                setCarouselApi(api);
              }}
              opts={{
                loop: true,
                align: "start",
                axis: "x",
              }}
              className="w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <CarouselContent className="gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <CarouselItem
                    key={item}
                    className="basis-full sm:basis-1/2 md:basis-1/4"
                  >
                    <div>
                      <Card className="group overflow-hidden rounded-none border-0 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg py-0">
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className={`hidden sm:flex -left-5 ${luxuryNavButtonClassName}`}
              />
              <CarouselNext
                className={`hidden sm:flex -right-5 ${luxuryNavButtonClassName}`}
              />
            </Carousel>

            <div className="mt-5 flex items-center justify-center gap-3 sm:hidden">
              <Button
                variant="default"
                size="icon"
                onClick={handlePrev}
                className={mobileNavButtonClassName}
                aria-label="Slide trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handleNext}
                className={mobileNavButtonClassName}
                aria-label="Slide tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full bg-background">
        <div className="mx-auto w-full max-w-7xl p-0 lg:px-6">
          <div className="mb-6 flex flex-col items-center gap-2 lg:mb-8">
            <div className="section-header">
              <h2>DỰ ÁN GẦN ĐÂY</h2>
            </div>
            <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground lg:text-base">
              Khám phá những công trình tiêu biểu mà Quân Bảo đã triển khai với
              tiêu chuẩn thi công cao, tiến độ rõ ràng và chất lượng hoàn thiện
              đồng bộ.
            </p>
          </div>
          <div className="text-center py-8 text-red-600">
            Đã xảy ra lỗi khi tải dự án. Vui lòng thử lại sau.
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!projects || projects.length === 0) {
    return (
      <section className="w-full bg-background">
        <div className="mx-auto w-full max-w-7xl p-0 lg:px-6">
          <div className="mb-6 flex flex-col items-center gap-2 lg:mb-8">
            <div className="section-header">
              <h2>DỰ ÁN GẦN ĐÂY</h2>
            </div>
            <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground lg:text-base">
              Khám phá những công trình tiêu biểu mà Quân Bảo đã triển khai với
              tiêu chuẩn thi công cao, tiến độ rõ ràng và chất lượng hoàn thiện
              đồng bộ.
            </p>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            Chưa có dự án nào.
          </div>
        </div>
      </section>
    );
  }

  // Use only first 8 projects for carousel
  const projectImages = projects.slice(0, 8).map((project) => ({
    src: project.image,
    link: `/projects/${project.slug || project._id}`,
    title: project.title,
  }));

  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-full max-w-7xl p-0 lg:px-6">
        <div className="mb-6 flex flex-col items-center gap-2 lg:mb-8">
          <div className="section-header">
            <h2>DỰ ÁN GẦN ĐÂY</h2>
          </div>
          <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground lg:text-base">
            Khám phá những công trình tiêu biểu mà Quân Bảo đã triển khai với
            tiêu chuẩn thi công cao, tiến độ rõ ràng và chất lượng hoàn thiện
            đồng bộ.
          </p>
        </div>

        <div className="relative">
          <Carousel
            setApi={(api) => {
              setCarouselApi(api);
            }}
            opts={{
              loop: true,
              align: "start",
              axis: "x",
            }}
            className="w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <CarouselContent className="gap-3">
              {projectImages.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 md:basis-1/4"
                >
                  <div>
                    <Card className="group overflow-hidden rounded-none border-0 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg py-0">
                      <Link href={image.link} className="block">
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                          <CmsImage
                            src={image.src}
                            alt={image.title}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                              Xem chi tiết
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={`hidden sm:flex -left-5 ${luxuryNavButtonClassName}`}
            />
            <CarouselNext
              className={`hidden sm:flex -right-5 ${luxuryNavButtonClassName}`}
            />
          </Carousel>

          <div className="mt-5 flex items-center justify-center gap-3 sm:hidden">
            <Button
              variant="default"
              size="icon"
              onClick={handlePrev}
              className={mobileNavButtonClassName}
              aria-label="Slide trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleNext}
              className={mobileNavButtonClassName}
              aria-label="Slide tiếp theo"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
