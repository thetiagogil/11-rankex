import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import type { LucideIcon } from "lucide-react";

type DashboardMetricCardProps = {
  accent: "accent" | "cyan" | "gold" | "primary";
  icon: LucideIcon;
  label: string;
  value: number;
};

export const DashboardMetricCard = ({
  accent,
  icon: Icon,
  label,
  value,
}: DashboardMetricCardProps) => {
  return (
    <Card as="article" className="relative gap-0 p-6" variant="shadow">
      <span
        className={cn(
          "absolute top-6 right-6 grid size-9 shrink-0 place-items-center rounded-2xl border",
          accent === "primary" &&
            "border-primary/35 bg-primary/10 text-primary",
          accent === "accent" && "border-accent/35 bg-accent/15 text-accent",
          accent === "cyan" && "border-cyan/35 bg-cyan/15 text-cyan",
          accent === "gold" && "border-gold/35 bg-gold/15 text-gold",
        )}
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
      </span>

      <div className="flex flex-col gap-1.5 pr-12">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          {label}
        </p>
        <p
          className={cn(
            "font-display text-4xl leading-none font-bold sm:text-5xl",
            accent === "primary" && "text-primary",
            accent === "accent" && "text-accent",
            accent === "cyan" && "text-cyan",
            accent === "gold" && "text-gold",
          )}
        >
          {value}
        </p>
      </div>
    </Card>
  );
};
