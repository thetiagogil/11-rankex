import type { Tier } from "@/features/lists/types";
import { cn } from "@/shared/utils/cn";

type TierBadgeProps = {
  tier: Tier;
  size?: "md" | "lg";
};

const tierClasses: Record<Tier, string> = {
  S: "border-tier-s/50 bg-tier-s/15 text-tier-s",
  A: "border-tier-a/50 bg-tier-a/15 text-tier-a",
  B: "border-tier-b/50 bg-tier-b/15 text-tier-b",
  C: "border-tier-c/50 bg-tier-c/15 text-tier-c",
  D: "border-tier-d/50 bg-tier-d/15 text-tier-d",
};

export function TierBadge({ size = "md", tier }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "font-display inline-grid shrink-0 place-items-center rounded-md border font-bold",
        size === "lg" ? "size-12 text-xl" : "size-8 text-sm",
        tierClasses[tier],
      )}
    >
      {tier}
    </span>
  );
}
