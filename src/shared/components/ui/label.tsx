import type { LabelHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ children, className, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-foreground inline-flex items-center gap-1 font-sans text-sm font-semibold tracking-normal normal-case",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <>
          <span
            aria-hidden="true"
            className="text-primary font-sans text-sm leading-none font-bold"
          >
            *
          </span>
          <span className="sr-only"> required</span>
        </>
      ) : null}
    </label>
  );
}
