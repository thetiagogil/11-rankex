import * as React from "react";

import {
  RARITY_BORDER_CLASS,
  RARITY_TEXT_CLASS,
} from "@/shared/constants/rarity";
import type { Rarity } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type CardElement = "article" | "div" | "section";
type CardTone = "accent" | "danger" | "default" | "primary";

const borders: Record<CardTone, string> = {
  accent: "border-accent/45",
  danger: "border-destructive/40",
  default: "border-border",
  primary: "border-primary/35",
};

const cornerTones: Record<CardTone, string> = {
  accent: "text-accent",
  danger: "text-destructive",
  default: "text-border",
  primary: "text-primary",
};

function Card({
  as: Component = "div",
  children,
  className,
  corners = false,
  gradient = false,
  interactive = false,
  rarity,
  size = "default",
  tone = "default",
  ...props
}: React.ComponentProps<"div"> & {
  as?: CardElement;
  corners?: boolean;
  gradient?: boolean;
  interactive?: boolean;
  rarity?: Rarity;
  size?: "default" | "sm";
  tone?: CardTone;
}) {
  const borderClass = rarity ? RARITY_BORDER_CLASS[rarity] : borders[tone];
  const cornerClass = rarity ? RARITY_TEXT_CLASS[rarity] : cornerTones[tone];

  return (
    <Component
      className={cn(
        "sticker-card group/card relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-card py-4 text-sm text-card-foreground transition-all has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-3xl *:[img:last-child]:rounded-b-3xl",
        borderClass,
        className,
      )}
      data-interactive={interactive ? "true" : undefined}
      data-size={size}
      data-slot="card"
      {...props}
    >
      {gradient ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
      ) : null}
      {corners ? (
        <>
          <span
            className={cn(
              "absolute top-2 left-2 size-2 border-t-2 border-l-2 border-current opacity-60",
              cornerClass,
            )}
          />
          <span
            className={cn(
              "absolute top-2 right-2 size-2 border-t-2 border-r-2 border-current opacity-60",
              cornerClass,
            )}
          />
          <span
            className={cn(
              "absolute bottom-2 left-2 size-2 border-b-2 border-l-2 border-current opacity-60",
              cornerClass,
            )}
          />
          <span
            className={cn(
              "absolute right-2 bottom-2 size-2 border-r-2 border-b-2 border-current opacity-60",
              cornerClass,
            )}
          />
        </>
      ) : null}
      {children}
    </Component>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/card-header @container/card-header relative z-10 grid auto-rows-min items-start gap-1 px-5 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4",
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-display text-2xl leading-none font-bold group-data-[size=sm]/card:text-xl",
        className,
      )}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative z-10 px-5 group-data-[size=sm]/card:px-4",
        className,
      )}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative z-10 flex items-center border-t-2 border-dashed bg-secondary/55 p-5 group-data-[size=sm]/card:p-4",
        className,
      )}
      data-slot="card-footer"
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
