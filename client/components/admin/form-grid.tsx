import { cn } from "@/lib/utils";

interface FormGridProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGrid({ children, className }: FormGridProps) {
  return (
    <div
      className={cn("grid min-w-0 grid-cols-1 gap-4 pb-6 md:grid-cols-2 md:gap-6", className)}
    >
      {children}
    </div>
  );
}
