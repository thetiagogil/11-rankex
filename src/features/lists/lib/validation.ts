import { isTier, type Tier } from "@/features/lists/lib/tiers";

export type ListInput = {
  description?: string | null;
  emoji?: string | null;
  isPublic: boolean;
  title: string;
  topic?: string | null;
};

export type NormalizedListInput = {
  description: string | null;
  emoji: string | null;
  isPublic: boolean;
  title: string;
  topic: string | null;
};

export type ItemInput = {
  note?: string | null;
  score?: number | string | null;
  tier?: Tier | "" | null;
  title: string;
};

export type NormalizedItemInput = {
  note: string | null;
  score: number | null;
  tier: Tier | null;
  title: string;
};

const titleMaxLength = 120;
const topicMaxLength = 80;
const descriptionMaxLength = 500;
const noteMaxLength = 800;
const emojiMaxLength = 16;

export function normalizeListInput(
  input: ListInput,
):
  | { ok: true; data: NormalizedListInput }
  | { ok: false; error: string } {
  const title = input.title.trim();
  const topic = input.topic?.trim() || null;
  const description = input.description?.trim() || null;
  const emoji = input.emoji?.trim() || null;

  if (!title) return { ok: false, error: "List title is required." };

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

  if (emoji && emoji.length > emojiMaxLength) {
    return { ok: false, error: "Emoji must be a short label." };
  }

  return {
    ok: true,
    data: {
      description,
      emoji,
      isPublic: input.isPublic,
      title,
      topic,
    },
  };
}

export function normalizeItemInput(
  input: ItemInput,
):
  | { ok: true; data: NormalizedItemInput }
  | { ok: false; error: string } {
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

  return {
    ok: true,
    data: {
      note,
      score,
      tier,
      title,
    },
  };
}

export function normalizeListId(value: string | number) {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(value.trim(), 10);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function normalizeScore(value: ItemInput["score"]): number | null | false {
  if (value === null || value === undefined || value === "") return null;

  const score = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(score) || score < 0 || score > 100) {
    return false;
  }

  return score;
}
