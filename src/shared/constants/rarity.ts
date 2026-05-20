import type { Rarity } from "@/shared/types";

export const RARITY_BORDER_CLASS: Record<Rarity, string> = {
  common: "border-rarity-common/40",
  uncommon: "border-rarity-uncommon/60",
  rare: "border-rarity-rare/60",
  epic: "border-rarity-epic/60",
  legendary: "border-rarity-legendary/70",
};

export const RARITY_TEXT_CLASS: Record<Rarity, string> = {
  common: "text-rarity-common",
  uncommon: "text-rarity-uncommon",
  rare: "text-rarity-rare",
  epic: "text-rarity-epic",
  legendary: "text-rarity-legendary",
};

export const RARITY_BADGE_CLASS: Record<Rarity, string> = {
  common: "border-rarity-common/40 bg-background/50 text-rarity-common",
  uncommon: "border-rarity-uncommon/60 bg-background/50 text-rarity-uncommon",
  rare: "border-rarity-rare/60 bg-background/50 text-rarity-rare",
  epic: "border-rarity-epic/60 bg-background/50 text-rarity-epic",
  legendary:
    "border-rarity-legendary/70 bg-background/50 text-rarity-legendary",
};

export const RARITY_GLOW_CLASS: Record<Rarity, string> = {
  common: "",
  uncommon: "",
  rare: "hover:shadow-[0_0_30px_-8px_var(--color-rarity-rare)]",
  epic: "hover:shadow-[0_0_30px_-8px_var(--color-rarity-epic)]",
  legendary:
    "animate-pulse-glow hover:shadow-[0_0_40px_-8px_var(--color-rarity-legendary)]",
};
