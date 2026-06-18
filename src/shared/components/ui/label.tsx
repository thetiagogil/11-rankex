"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/shared/utils/cn";

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

export const Label = ({
  children,
  className,
  required,
  ...props
}: LabelProps) => {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-foreground inline-flex items-center gap-1 font-sans text-sm leading-none font-semibold tracking-normal normal-case select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      data-slot="label"
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
    </LabelPrimitive.Root>
  );
};
