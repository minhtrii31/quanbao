import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      <div className="min-w-0">
        <h3 className="break-words text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 break-words text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="min-w-0 space-y-4">{children}</div>
    </div>
  );
}
