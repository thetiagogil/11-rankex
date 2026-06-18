import type { ReactNode } from "react";

import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/cn";

type DividerLabelProps = {
  children: ReactNode;
  className?: string;
};

export const DividerLabel = ({ children, className }: DividerLabelProps) => {
  return (
    <div
      className={cn(
        "text-muted-foreground flex w-full items-center gap-3 text-xs",
        className,
      )}
    >
      <Separator className="flex-1" />
      <span>{children}</span>
      <Separator className="flex-1" />
    </div>
  );
};
