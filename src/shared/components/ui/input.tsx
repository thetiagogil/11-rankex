import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-border bg-card text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus-visible:border-secondary focus-visible:ring-ring flex h-10 w-full rounded-lg border px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
