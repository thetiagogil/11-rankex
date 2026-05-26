import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type FormActionsProps = {
  border?: boolean;
  children: ReactNode;
  className?: string;
  leading?: ReactNode;
};

export function FormActions({
  border = true,
  children,
  className,
  leading,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 sm:flex-row sm:items-center",
        border && "border-border border-t border-dashed pt-4",
        leading ? "sm:justify-between" : "sm:justify-end",
        className,
      )}
    >
      {leading ? <div className="flex sm:justify-start">{leading}</div> : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {children}
      </div>
    </div>
  );
}
