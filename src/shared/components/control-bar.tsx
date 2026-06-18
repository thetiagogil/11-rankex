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

export const ControlBar = ({ children, className }: ControlBarProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ControlBarGroup = ({
  children,
  className,
}: ControlBarGroupProps) => {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch",
        className,
      )}
    >
      {children}
    </div>
  );
};
