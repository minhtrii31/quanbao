import CarouselHome from "@/components/public/home/carousel-home";
import LatestProjectHome from "@/components/public/home/latest-project-home";
import OverviewHome from "@/components/public/home/overview-home";
import LatestNewsHome from "@/components/public/home/latest-news-home";
import ServicesHome from "@/components/public/home/services-home";
import ProcessHome from "@/components/public/home/process-home";
import ContactBanner from "@/components/public/contact-banner";
import { getHomeContent } from "@/lib/page-content";

export default async function Home() {
  const content = await getHomeContent();
  const heroImages = [
    ...content.heroImages.slice(2),
    ...content.heroImages.slice(0, 2),
  ];
  return (
    <>
      <CarouselHome images={heroImages} />
      <OverviewHome content={content.overview} />
      <ServicesHome />
      <LatestProjectHome />
      <ProcessHome />
      <LatestNewsHome />
      <ContactBanner />
    </>
  );
}
