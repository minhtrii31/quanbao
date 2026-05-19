"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

export default function CarouselHome({ images }: { images: string[] }) {
  const [emblaApi, setEmblaApi] = useState<
    ReturnType<typeof useEmblaCarousel>[1] | null
  >(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi, isPaused]);

  return (
    <Carousel
      setApi={setEmblaApi}
      opts={{
        loop: true,
        align: "start",
      }}
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hình ảnh giới thiệu công ty"
    >
      <CarouselContent>
        {(images.length ? images : ["/assets/home/1.avif"]).map((src, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-[75vh] overflow-hidden">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
