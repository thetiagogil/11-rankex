import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { RARITY_BADGE_CLASS } from "@/shared/constants/rarity";
import type { Rarity } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border-2 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest whitespace-nowrap uppercase shadow-[2px_2px_0_0_var(--shadow-ink)] transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-foreground bg-card text-foreground",
        primary: "border-foreground bg-primary text-primary-foreground",
        secondary: "border-foreground bg-secondary text-secondary-foreground",
        surface: "border-foreground bg-muted text-muted-foreground",
        accent: "border-foreground bg-accent text-accent-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
        danger: "border-destructive bg-destructive text-destructive-foreground",
        outline: "border-foreground bg-transparent text-foreground",
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
