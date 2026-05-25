"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/shared/utils/cn";

type ProgressSize = "md" | "sm";

const sizes: Record<ProgressSize, string> = {
  md: "h-2",
  sm: "h-1.5",
};

function Progress({
  className,
  size = "md",
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  size?: ProgressSize;
}) {
  const boundedValue = Math.max(0, Math.min(100, value ?? 0));

  return (
    <ProgressPrimitive.Root
      className={cn(
        "border-border bg-surface-elevated relative flex w-full items-center overflow-x-hidden rounded-full border",
        sizes[size],
        className,
      )}
      data-slot="progress"
      max={100}
      value={boundedValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="from-primary via-accent to-primary size-full flex-1 bg-linear-to-r transition-all"
        data-slot="progress-indicator"
        style={{
          backgroundSize: "200% 100%",
          transform: `translateX(-${100 - boundedValue}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
