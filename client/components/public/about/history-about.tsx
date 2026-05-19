export default function HistoryAbout({ milestones }: { milestones: Array<{ year: string; title: string; description: string }> }) {
  return (
    <section className="w-full bg-muted/50 py-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-2 section-header">
            Hành trình
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Lịch sử phát triển
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 lg:gap-0 cursor-pointer ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div
                  className={`hidden lg:block lg:w-1/2 ${i % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}
                >
                  <div className="rounded-none border border-border bg-card p-6 hover:shadow-lg transition-shadow duration-300">
                    <span className="text-2xl font-bold text-primary text-center w-full block">
                      {m.year} - {m.title}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1 text-center">
                      {m.description}
                    </p>
                  </div>
                </div>
                <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 z-10">
                  <div className="h-3 w-3 rounded-full bg-primary border-4 border-background shadow-lg" />
                </div>
                <div className="w-full lg:w-1/2 pl-14 lg:pl-0">
                  <div className="lg:hidden rounded-xl border border-border bg-card p-6">
                    <span className="text-2xl font-bold text-primary">
                      {m.year}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1">
                      {m.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {m.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
