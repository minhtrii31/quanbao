import { cn } from "@/lib/utils";
import { isApprovedCmsImageUrl } from "@/lib/cms-url";

interface CmsImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CmsImage({ src, alt, className }: CmsImageProps) {
  if (!isApprovedCmsImageUrl(src)) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS images are validated before rendering.
    <img
      src={src}
      alt={alt}
      className={cn("absolute inset-0 h-full w-full", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
