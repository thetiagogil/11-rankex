import type { ReactNode } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";

type CountPillProps = {
  className?: string;
  icon: ReactNode;
  size?: "default" | "lg" | "sm";
  singularLabel: string;
  value: number;
  width?: "action" | "auto";
};

export const CountPill = ({
  className,
  icon,
  size = "sm",
  singularLabel,
  value,
  width = "auto",
}: CountPillProps) => {
  const label = value === 1 ? singularLabel : `${singularLabel}s`;

  return (
    <Badge
      aria-label={`${value} ${label}`}
      className={cn(
        "bg-background gap-1 rounded-full font-sans tracking-normal normal-case",
        size === "sm" && "h-7 px-2 text-xs",
        size === "default" && "h-8 px-2.5 text-xs",
        size === "lg" && "h-10 px-2.5 text-sm",
        width === "action" && size === "sm" && "min-w-10 justify-center",
        width === "action" && size === "default" && "min-w-11 justify-center",
        width === "action" && size === "lg" && "min-w-[3.75rem] justify-center",
        className,
      )}
      title={`${value} ${label}`}
      variant="outline"
    >
      {icon}
      {value}
    </Badge>
  );
};
