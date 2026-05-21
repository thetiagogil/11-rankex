import type { Tier } from "@/features/lists/types";
import { cn } from "@/shared/utils/cn";

type TierBadgeProps = {
  tier: Tier;
  size?: "md" | "lg";
};

const tierClasses: Record<Tier, string> = {
  S: "bg-tier-s text-white",
  A: "bg-tier-a text-white",
  B: "bg-tier-b text-foreground",
  C: "bg-tier-c text-foreground",
  D: "bg-tier-d text-white",
};

export function TierBadge({ size = "md", tier }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "font-display inline-grid shrink-0 place-items-center rounded-xl border-2 border-foreground font-bold shadow-[3px_3px_0_0_var(--shadow-ink)]",
        size === "lg" ? "size-12 text-2xl" : "size-9 text-base",
        tierClasses[tier],
      )}
    >
      {tier}
    </span>
  );
}
