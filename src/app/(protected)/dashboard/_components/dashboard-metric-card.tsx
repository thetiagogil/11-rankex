import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type DashboardMetricCardProps = {
  accent: "accent" | "cyan" | "gold" | "primary";
  label: string;
  value: number;
};

export function DashboardMetricCard({
  accent,
  label,
  value,
}: DashboardMetricCardProps) {
  return (
    <Card as="article" className="gap-0 p-5" variant="shadow">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
        {label}
      </p>
      <p
        className={cn(
          "font-display mt-2 text-5xl leading-none font-bold",
          accent === "primary" && "text-primary",
          accent === "accent" && "text-accent",
          accent === "cyan" && "text-cyan",
          accent === "gold" && "text-gold",
        )}
      >
        {value}
      </p>
    </Card>
  );
}
