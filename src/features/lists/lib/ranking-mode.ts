import type { RankingMode } from "@/features/lists/types";

export const rankingModes = ["ranked", "scored", "tiered"] as const;

export const rankingModeLabels: Record<RankingMode, string> = {
  ranked: "Ranked order",
  scored: "Scores",
  tiered: "Tiers",
};

export const rankingModeDescriptions: Record<RankingMode, string> = {
  ranked: "Manual order. Drag items into the exact ranking.",
  scored: "Numeric values. Items sort from highest score to lowest.",
  tiered: "S to D groups. Items are grouped by tier, not exact order.",
};

export const isRankingMode = (value: unknown): value is RankingMode => {
  return (
    typeof value === "string" &&
    (rankingModes as readonly string[]).includes(value)
  );
};

export const normalizeRankingMode = (value: unknown): RankingMode => {
  return isRankingMode(value) ? value : "ranked";
};

export const getRankingModeLabel = (mode: unknown) => {
  return rankingModeLabels[normalizeRankingMode(mode)];
};
