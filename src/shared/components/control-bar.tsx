import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type ControlBarProps = {
  children: ReactNode;
  className?: string;
};

type ControlBarGroupProps = {
  children: ReactNode;
  className?: string;
};

export function ControlBar({ children, className }: ControlBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ControlBarGroup({ children, className }: ControlBarGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-stretch",
        className,
      )}
    >
      {children}
    </div>
  );
}
