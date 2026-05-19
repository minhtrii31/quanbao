import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  saveText: string;
  cancelHref: string;
  disabled?: boolean;
}

export function FormActions({ saveText, cancelHref, disabled = false }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-muted-foreground">
        Nhấn <kbd className="px-1.5 py-0.5 bg-muted rounded">⌘S</kbd> để lưu nhanh
      </div>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
        <Button variant="outline" asChild className="rounded-none">
          <Link href={cancelHref}>Hủy</Link>
        </Button>
        <Button className="rounded-none shadow-sm" disabled={disabled}>
          <Save className="h-4 w-4 mr-2" />
          {saveText}
        </Button>
      </div>
    </div>
  );
}
