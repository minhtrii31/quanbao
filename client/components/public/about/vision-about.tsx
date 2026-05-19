import { AboutContent } from "@/lib/page-content";

export default function VisionAbout({ content }: { content: AboutContent["vision"] }) {
  return (
    <section className="w-full bg-background py-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-2 section-header">
            Định hướng
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            {content.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <div className="group relative rounded-none border border-border bg-gradient-to-br from-card to-primary/5 p-8 lg:p-10 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            <p className="text-base text-muted-foreground leading-relaxed text-center font-semibold">
              {content.vision}
            </p>
          </div>

          <div className="group relative rounded-none border border-border bg-gradient-to-br from-card to-primary/5 p-8 lg:p-10 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            <p className="text-base text-muted-foreground leading-relaxed text-center font-semibold">
              {content.mission}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
