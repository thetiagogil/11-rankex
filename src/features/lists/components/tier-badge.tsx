import type { Tier } from "@/features/lists/types";
import { cn } from "@/shared/utils/cn";

type TierBadgeProps = {
  tier: Tier;
  size?: "md" | "lg";
};

const tierClasses: Record<Tier, string> = {
  S: "border-red-400/50 bg-red-400/10 text-red-200",
  A: "border-amber-300/50 bg-amber-300/10 text-amber-100",
  B: "border-lime-300/50 bg-lime-300/10 text-lime-100",
  C: "border-cyan-300/50 bg-cyan-300/10 text-cyan-100",
  D: "border-sky-300/50 bg-sky-300/10 text-sky-100",
};

export function TierBadge({ size = "md", tier }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "font-display inline-grid shrink-0 place-items-center rounded-md border font-bold",
        size === "lg" ? "h-12 w-12 text-xl" : "h-8 w-8 text-sm",
        tierClasses[tier],
      )}
    >
      {tier}
    </span>
  );
}
