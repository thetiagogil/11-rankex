import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AlertTone = "error" | "success";

type AlertProps = ComponentPropsWithoutRef<"div"> & {
  tone?: AlertTone;
};

const tones: Record<AlertTone, string> = {
  error: "border-destructive bg-destructive text-destructive-foreground",
  success: "border-foreground bg-tier-c text-foreground",
};

export function Alert({ className, tone = "error", ...props }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-3 py-2 font-mono text-xs leading-5 shadow-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
