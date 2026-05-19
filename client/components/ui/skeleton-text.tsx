import { cn } from "@/lib/utils"

interface SkeletonTextProps {
  className?: string
  lines?: number
}

function SkeletonText({ className, lines = 1 }: SkeletonTextProps) {
  const widthPresets = ["100%", "86%", "74%", "92%", "68%"]

  return (
    <>
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          data-slot="skeleton-text"
          className={cn(
            "animate-pulse bg-muted rounded inline-block",
            className,
            i < lines - 1 && "mr-2"
          )}
          style={{
            height: i === 0 ? "1em" : "0.8em",
            width: widthPresets[i % widthPresets.length],
          }}
        />
      ))}
    </>
  )
}

export { SkeletonText }
