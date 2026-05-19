import CarouselHome from "@/components/public/home/carousel-home";
import CoreValueHome from "@/components/public/home/core-value-home";
import LatestProjectHome from "@/components/public/home/latest-project-home";
import OverviewHome from "@/components/public/home/overview-home";
import LatestNewsHome from "@/components/public/home/latest-news-home";
import { getHomeContent } from "@/lib/page-content";

export default async function Home() {
  const content = await getHomeContent();

  return (
    <div className="">
      <CarouselHome images={content.heroImages} />
      <div className="p-6 space-y-6">
        <OverviewHome content={content.overview} />
        <CoreValueHome values={content.values} />
        <LatestProjectHome />
        <LatestNewsHome />
      </div>
    </div>
  );
}
