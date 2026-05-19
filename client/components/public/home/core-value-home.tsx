import Image from "next/image";
import { ValueBlock } from "@/lib/page-content";

export default function CoreValueHome({ values }: { values: ValueBlock[] }) {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-full max-w-7xl p-0 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 py-2 px-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {value.image && <Image
                  src={value.image}
                  alt={value.title}
                  width={50}
                  height={50}
                  className="w-10 h-10 object-contain"
                />}
              </div>
              <h3 className="text-lg font-bold text-primary uppercase tracking-wide">
                {value.title}
              </h3>
              <p className="text-sm lg:text-base text-foreground leading-relaxed text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
