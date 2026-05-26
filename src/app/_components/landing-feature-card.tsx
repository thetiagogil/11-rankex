import type { LandingFeatureCard as LandingFeatureCardData } from "@/app/_types/landing";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type LandingFeatureCardProps = {
  feature: LandingFeatureCardData;
};

export function LandingFeatureCard({ feature }: LandingFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <Card
      as="article"
      className={cn("rounded-3xl p-6", feature.tilt)}
      variant="settle"
    >
      <div className="flex items-center gap-3">
        <span
          className="text-foreground grid size-12 shrink-0 place-items-center rounded-2xl"
          style={{ background: feature.accent }}
        >
          <Icon className="size-6" strokeWidth={2.5} />
        </span>
        <h3 className="font-display text-2xl leading-tight font-bold">
          {feature.title}
        </h3>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {feature.description}
      </p>
    </Card>
  );
}
