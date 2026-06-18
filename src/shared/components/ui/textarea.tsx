import * as React from "react";

import { cn } from "@/shared/utils/cn";

const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-foreground/45 bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/25 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex field-sizing-content min-h-20 w-full rounded-lg border px-4 py-3 text-base font-medium shadow-none transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      {...props}
    />
  );
};

export { Textarea };
