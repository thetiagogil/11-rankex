import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";

type AlertTone = "error" | "success";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl border px-3 py-2 text-left text-sm shadow-none has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
        success: "border-foreground bg-tier-c text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const toneVariants: Record<AlertTone, NonNullable<AlertVariant>> = {
  error: "destructive",
  success: "success",
};

type AlertVariant = VariantProps<typeof alertVariants>["variant"];

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    tone?: AlertTone;
  };

const Alert = ({ className, tone, variant, ...props }: AlertProps) => {
  const resolvedVariant = variant ?? (tone ? toneVariants[tone] : "default");

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant: resolvedVariant }),
        "font-mono text-xs leading-5",
        className,
      )}
      {...props}
    />
  );
};

const AlertTitle = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "[&_a]:hover:text-foreground font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3",
        className,
      )}
      data-slot="alert-title"
      {...props}
    />
  );
};

const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "text-muted-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  );
};

const AlertAction = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("absolute top-2 right-2", className)}
      data-slot="alert-action"
      {...props}
    />
  );
};

export { Alert, AlertAction, AlertDescription, AlertTitle };
