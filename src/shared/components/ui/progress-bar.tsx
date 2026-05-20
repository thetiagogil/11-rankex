"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type ProgressBarSize = "sm" | "md";

type ProgressBarProps = ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  size?: ProgressBarSize;
  value: number;
};

const sizes: Record<ProgressBarSize, string> = {
  md: "h-2",
  sm: "h-1.5",
};

export function ProgressBar({
  className,
  size = "md",
  value,
  ...props
}: ProgressBarProps) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <ProgressPrimitive.Root
      className={cn(
        "border-border bg-surface-elevated w-full overflow-hidden rounded-full border",
        sizes[size],
        className,
      )}
      max={100}
      value={boundedValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="from-primary via-accent to-primary h-full bg-linear-to-r transition-transform"
        style={{
          backgroundSize: "200% 100%",
          transform: `translateX(-${100 - boundedValue}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}
