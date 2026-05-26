import type { Tier } from "@/features/lists/types";

export type { Tier };

export const TIERS: Tier[] = ["S", "A", "B", "C", "D"];

export function isTier(value: unknown): value is Tier {
  return typeof value === "string" && TIERS.includes(value as Tier);
}
