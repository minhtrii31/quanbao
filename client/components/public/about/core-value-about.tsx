import Image from "next/image";
import { ValueBlock } from "@/lib/page-content";

export default function CoreValueAbout({ values }: { values: ValueBlock[] }) {
  return (
    <section className="w-full bg-background py-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-2 section-header">
            Giá trị cốt lõi
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Những nguyên tắc dẫn đường
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative border border-border bg-card p-8 text-center hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-6">
                {value.image && <Image
                  src={value.image}
                  alt={value.title}
                  width={50}
                  height={50}
                  className="w-10 h-10 object-contain"
                />}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
