import HeroAbout from "@/components/public/about/hero-about";
import StatsAbout from "@/components/public/about/stats-about";
import CoreValueAbout from "@/components/public/about/core-value-about";
import HistoryAbout from "@/components/public/about/history-about";
import VisionAbout from "@/components/public/about/vision-about";
import { getAboutContent } from "@/lib/page-content";

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div>
      <HeroAbout content={content.hero} />
      <StatsAbout stats={content.stats} />
      <CoreValueAbout values={content.values} />
      <HistoryAbout milestones={content.timeline} />
      <VisionAbout content={content.vision} />
    </div>
  );
}
