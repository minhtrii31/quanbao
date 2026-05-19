export default function StatsAbout({ stats }: { stats: Array<{ number: string; label: string }> }) {
  return (
    <section className="w-full bg-primary py-12 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-white">
                {stat.number}
              </div>
              <div className="text-sm text-white/80 font-medium uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
