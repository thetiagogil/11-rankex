import { isTier, type Tier } from "@/features/lists/lib/tiers";
import { resolveListIconId } from "@/features/lists/lib/list-icon-data";
import { isRankingMode } from "@/features/lists/lib/ranking-mode";
import type { RankingMode } from "@/features/lists/types";

export type ListInput = {
  description?: string | null;
  emoji?: string | null;
  isPublic: boolean;
  rankingMode: RankingMode;
  title: string;
  topic?: string | null;
};

export type NormalizedListInput = {
  description: string | null;
  emoji: string | null;
  isPublic: boolean;
  rankingMode: RankingMode;
  title: string;
  topic: string | null;
};

export type ItemInput = {
  note?: string | null;
  score?: number | string | null;
  tier?: Tier | "" | null;
  title: string;
};

export type TierReorderInputItem = {
  id: number | string;
  tier?: Tier | "" | null;
};

export type NormalizedItemInput = {
  note: string | null;
  score: number | null;
  tier: Tier | null;
  title: string;
};

export type NormalizedTierReorderInputItem = {
  id: number;
  tier: Tier | null;
};

const titleMaxLength = 120;
const topicMaxLength = 80;
const descriptionMaxLength = 500;
const noteMaxLength = 800;
const iconMaxLength = 16;

export const normalizeListInput = (
  input: ListInput,
): { ok: true; data: NormalizedListInput } | { ok: false; error: string } => {
  const title = input.title.trim();
  const topic = input.topic?.trim() || null;
  const description = input.description?.trim() || null;
  const icon = input.emoji?.trim() || null;

  if (!title) return { ok: false, error: "List title is required." };
  if (!isRankingMode(input.rankingMode)) {
    return { ok: false, error: "Choose a valid ranking style." };
  }

  if (title.length > titleMaxLength) {
    return {
      ok: false,
      error: `List title must be ${titleMaxLength} characters or fewer.`,
    };
  }

  if (topic && topic.length > topicMaxLength) {
    return {
      ok: false,
      error: `Topic must be ${topicMaxLength} characters or fewer.`,
    };
  }

  if (description && description.length > descriptionMaxLength) {
    return {
      ok: false,
      error: `Description must be ${descriptionMaxLength} characters or fewer.`,
    };
  }

  if (icon && icon.length > iconMaxLength) {
    return { ok: false, error: "Icon must be a short label." };
  }

  return {
    ok: true,
    data: {
      description,
      emoji: resolveListIconId(icon, topic),
      isPublic: input.isPublic,
      rankingMode: input.rankingMode,
      title,
      topic,
    },
  };
};

export const normalizeItemInput = (
  input: ItemInput,
  rankingMode: RankingMode,
): { ok: true; data: NormalizedItemInput } | { ok: false; error: string } => {
  const title = input.title.trim();
  const note = input.note?.trim() || null;
  const score = normalizeScore(input.score);
  const tier = input.tier ? input.tier : null;

  if (!title) return { ok: false, error: "Item title is required." };

  if (title.length > titleMaxLength) {
    return {
      ok: false,
      error: `Item title must be ${titleMaxLength} characters or fewer.`,
    };
  }

  if (note && note.length > noteMaxLength) {
    return {
      ok: false,
      error: `Item note must be ${noteMaxLength} characters or fewer.`,
    };
  }

  if (score === false) {
    return { ok: false, error: "Score must be a number from 0 to 100." };
  }

  if (tier && !isTier(tier)) {
    return { ok: false, error: "Tier must be S, A, B, C, or D." };
  }

  if (score !== null && tier !== null) {
    return { ok: false, error: "Use either a score or a tier, not both." };
  }

  if (rankingMode === "ranked") {
    if (score !== null || tier !== null) {
      return { ok: false, error: "Ranked lists only use manual order." };
    }

    return {
      ok: true,
      data: {
        note,
        score: null,
        tier: null,
        title,
      },
    };
  }

  if (rankingMode === "scored") {
    if (tier !== null) {
      return { ok: false, error: "Scored lists do not use tiers." };
    }
    if (score === null) {
      return { ok: false, error: "Score is required for scored lists." };
    }

    return {
      ok: true,
      data: {
        note,
        score,
        tier: null,
        title,
      },
    };
  }

  if (score !== null) {
    return { ok: false, error: "Tiered lists do not use scores." };
  }
  if (tier === null) {
    return { ok: false, error: "Tier is required for tiered lists." };
  }

  return {
    ok: true,
    data: {
      note,
      score: null,
      tier,
      title,
    },
  };
};

export const normalizeListId = (value: string | number) => {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(value.trim(), 10);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const normalizeTierReorderInput = (
  input: TierReorderInputItem[],
):
  | { ok: true; data: NormalizedTierReorderInputItem[] }
  | { ok: false; error: string } => {
  const seenIds = new Set<number>();
  const data: NormalizedTierReorderInputItem[] = [];

  for (const item of input) {
    const id = normalizeListId(item.id);
    if (!id) return { ok: false, error: "Invalid item id." };
    if (seenIds.has(id)) {
      return { ok: false, error: "Each item can only appear once." };
    }

    const tier = item.tier ? item.tier : null;
    if (tier && !isTier(tier)) {
      return { ok: false, error: "Tier must be S, A, B, C, or D." };
    }

    seenIds.add(id);
    data.push({ id, tier });
  }

  return { ok: true, data };
};

const normalizeScore = (value: ItemInput["score"]): number | null | false => {
  if (value === null || value === undefined || value === "") return null;

  const score = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(score) || score < 0 || score > 100) {
    return false;
  }

  return score;
};
