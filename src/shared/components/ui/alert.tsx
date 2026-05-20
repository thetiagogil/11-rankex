import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AlertTone = "error" | "success";

type AlertProps = ComponentPropsWithoutRef<"div"> & {
  tone?: AlertTone;
};

const tones: Record<AlertTone, string> = {
  error: "border-destructive/40 bg-destructive/10 text-destructive",
  success: "border-accent/50 bg-accent/10 text-accent",
};

export function Alert({ className, tone = "error", ...props }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-sm border px-3 py-2 font-mono text-xs leading-5",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
