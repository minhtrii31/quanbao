import { HomeContent } from "@/lib/page-content";

export default function OverviewHome({ content }: { content: HomeContent["overview"] }) {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-full max-w-7xl p-0 lg:px-6">
        <div className="section-header">
          <h2>{content.title}</h2>
        </div>

        <div className="max-w-7xl mx-auto space-y-5 pt-5">
          {content.intro.map((paragraph) => (
            <p key={paragraph} className="text-sm lg:text-base text-foreground leading-relaxed text-left">
              {paragraph}
            </p>
          ))}
          <p className="text-sm lg:text-base leading-relaxed text-left font-medium text-primary">
            {content.serviceIntro}
          </p>
          <ol className="space-y-3">
            {content.services.map((service, index) => (
              <li key={service} className="flex gap-3 text-sm lg:text-base text-foreground leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span>{service}</span>
              </li>
            ))}
          </ol>

          <div className="border-t border-border pt-5 space-y-3">
            {content.closing.map((paragraph) => (
              <p key={paragraph} className="text-sm lg:text-base text-foreground leading-relaxed text-left">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
