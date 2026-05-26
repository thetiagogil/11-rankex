import type { ReactNode } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";

type CountPillProps = {
  className?: string;
  icon: ReactNode;
  size?: "default" | "lg" | "sm";
  singularLabel: string;
  value: number;
};

export function CountPill({
  className,
  icon,
  size = "sm",
  singularLabel,
  value,
}: CountPillProps) {
  const label = value === 1 ? singularLabel : `${singularLabel}s`;

  return (
    <Badge
      aria-label={`${value} ${label}`}
      className={cn(
        "bg-background gap-1 rounded-full font-sans tracking-normal normal-case",
        size === "sm" && "h-7 px-2 text-xs",
        size === "default" && "h-8 px-2.5 text-xs",
        size === "lg" && "h-10 px-2.5 text-sm",
        className,
      )}
      title={`${value} ${label}`}
      variant="outline"
    >
      {icon}
      {value}
    </Badge>
  );
}
