import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-foreground/70 bg-foreground text-background shadow-[1px_1px_0_0_var(--color-primary)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_0_var(--color-primary)]",
        primary:
          "border-foreground/70 bg-foreground text-background shadow-[1px_1px_0_0_var(--color-primary)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_0_var(--color-primary)]",
        outline:
          "border-foreground/55 bg-card text-foreground shadow-[1px_1px_0_0_var(--color-accent)] hover:-translate-x-px hover:-translate-y-px hover:bg-secondary hover:shadow-[2px_2px_0_0_var(--color-accent)] aria-expanded:bg-secondary",
        secondary:
          "border-foreground/40 bg-secondary text-secondary-foreground shadow-none hover:-translate-x-px hover:-translate-y-px hover:bg-secondary/80 hover:shadow-[1px_1px_0_0_var(--shadow-ink)] aria-expanded:bg-secondary",
        ghost:
          "border-transparent text-foreground shadow-none hover:bg-foreground/5 aria-expanded:bg-foreground/5",
        destructive:
          "border-destructive/70 bg-destructive text-destructive-foreground shadow-[1px_1px_0_0_var(--shadow-ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_0_var(--shadow-ink)] focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        danger:
          "border-destructive/70 bg-destructive text-destructive-foreground shadow-[1px_1px_0_0_var(--shadow-ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_0_var(--shadow-ink)] focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "border-transparent bg-transparent text-primary shadow-none hover:bg-transparent hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        md: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-7 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9 p-0",
        "icon-xs": "size-7 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;

function Button({
  asChild = false,
  className,
  size = "default",
  type = "button",
  variant = "default",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}

export { Button, buttonVariants };
