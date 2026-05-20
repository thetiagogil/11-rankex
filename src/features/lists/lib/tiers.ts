import type { Tier } from "@/features/lists/types";

export type { Tier };

export const TIERS: Tier[] = ["S", "A", "B", "C", "D"];

export const tierLabels: Record<Tier, string> = {
  S: "S tier",
  A: "A tier",
  B: "B tier",
  C: "C tier",
  D: "D tier",
};

export const tierDescriptions: Record<Tier, string> = {
  S: "Essential",
  A: "Excellent",
  B: "Strong",
  C: "Mixed",
  D: "Low priority",
};

export function isTier(value: unknown): value is Tier {
  return typeof value === "string" && TIERS.includes(value as Tier);
}
