"use client";

import * as React from "react";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { cn } from "@/shared/utils/cn";

type SegmentedToggleGroupProps = React.ComponentProps<typeof ToggleGroup> & {
  wrap?: boolean;
};

type SegmentedToggleGroupItemProps = React.ComponentProps<
  typeof ToggleGroupItem
> & {
  labelStyle?: "mono" | "plain";
};

function SegmentedToggleGroup({
  className,
  spacing = 1,
  wrap = false,
  ...props
}: SegmentedToggleGroupProps) {
  return (
    <ToggleGroup
      className={cn(
        "border-foreground/20 bg-background/35 items-stretch rounded-2xl border p-1",
        wrap ? "h-auto flex-wrap" : "h-10 overflow-hidden",
        className,
      )}
      spacing={spacing}
      {...props}
    />
  );
}

function SegmentedToggleGroupItem({
  className,
  labelStyle = "mono",
  ...props
}: SegmentedToggleGroupItemProps) {
  return (
    <ToggleGroupItem
      className={cn(
        "text-muted-foreground hover:text-foreground hover:bg-foreground/5 data-[state=on]:bg-foreground data-[state=on]:text-background h-[1.875rem] rounded-xl border-0 px-3 leading-none",
        labelStyle === "mono"
          ? "font-mono text-xs tracking-widest uppercase"
          : "text-sm font-bold",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedToggleGroup, SegmentedToggleGroupItem };
