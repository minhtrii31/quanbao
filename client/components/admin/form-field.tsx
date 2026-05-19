import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "input" | "textarea";
  inputType?: React.ComponentProps<"input">["type"];
  rows?: number;
  required?: boolean;
  helperText?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "input",
  inputType = "text",
  rows,
  required = false,
  helperText,
  error,
  maxLength,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {maxLength && type === "textarea" && (
          <span className="shrink-0 text-xs text-muted-foreground">{value.length}/{maxLength}</span>
        )}
      </div>
      {type === "textarea" ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          rows={rows || 4}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn("rounded-none w-full resize-none")}
        />
      ) : (
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn("rounded-none w-full")}
        />
      )}
      {helperText && (
        <p id={`${id}-helper`} className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
