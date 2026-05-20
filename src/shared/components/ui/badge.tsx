import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { RARITY_BADGE_CLASS } from "@/shared/constants/rarity";
import type { Rarity } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest whitespace-nowrap uppercase transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-border bg-card/45 text-foreground",
        primary: "border-primary/40 bg-primary/10 text-primary",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        surface: "border-border bg-secondary/65 text-muted-foreground",
        accent: "border-accent/40 bg-accent/10 text-accent",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive",
        danger: "border-destructive/30 bg-destructive/10 text-destructive",
        outline: "border-border bg-transparent text-foreground",
        ghost: "border-transparent text-muted-foreground hover:bg-muted",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  asChild = false,
  className,
  rarity,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    rarity?: Rarity;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      className={cn(
        badgeVariants({ variant }),
        rarity ? RARITY_BADGE_CLASS[rarity] : null,
        className,
      )}
      data-slot="badge"
      data-variant={variant}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
