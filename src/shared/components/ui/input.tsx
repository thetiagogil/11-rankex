import * as React from "react";

import { cn } from "@/shared/utils/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-full border-2 border-foreground bg-card px-4 py-1 text-base font-medium text-foreground shadow-[2px_2px_0_0_var(--shadow-ink)] transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
