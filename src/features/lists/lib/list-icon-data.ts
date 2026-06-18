export type ListIconId =
  | "books"
  | "coffee"
  | "food"
  | "games"
  | "movies"
  | "music"
  | "sports"
  | "travel"
  | "trophy"
  | "work";

export const listIconIds = [
  "trophy",
  "movies",
  "games",
  "music",
  "food",
  "books",
  "sports",
  "travel",
  "coffee",
  "work",
] as const satisfies readonly ListIconId[];

const fallbackIconId: ListIconId = "trophy";

const topicIconMap: Record<string, ListIconId> = {
  album: "music",
  albums: "music",
  book: "books",
  books: "books",
  cafe: "coffee",
  cafes: "coffee",
  coffee: "coffee",
  food: "food",
  game: "games",
  games: "games",
  movie: "movies",
  movies: "movies",
  music: "music",
  restaurant: "food",
  restaurants: "food",
  sport: "sports",
  sports: "sports",
  travel: "travel",
  work: "work",
};

const legacyEmojiIconMap = new Map<string, ListIconId>([
  ["\u{1f3c6}", "trophy"],
  ["\u{1f3ac}", "movies"],
  ["\u{1f3ae}", "games"],
  ["\u{1f3b5}", "music"],
  ["\u{1f35c}", "food"],
  ["\u{1f4da}", "books"],
  ["\u26bd", "sports"],
  ["\u2708", "travel"],
  ["\u2708\ufe0f", "travel"],
  ["\u2615", "coffee"],
  ["\u{1f4bb}", "work"],
]);

export const resolveListIconId = (
  value: string | null,
  topic: string | null,
): ListIconId => {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue && isListIconId(normalizedValue)) {
    return normalizedValue;
  }

  const legacyIconId = value ? legacyEmojiIconMap.get(value.trim()) : null;
  if (legacyIconId) {
    return legacyIconId;
  }

  const normalizedTopic = topic?.trim().toLowerCase();
  if (normalizedTopic) {
    const exactTopicIconId = topicIconMap[normalizedTopic];
    if (exactTopicIconId) {
      return exactTopicIconId;
    }

    const fuzzyTopicIconId = Object.entries(topicIconMap).find(([keyword]) =>
      normalizedTopic.includes(keyword),
    )?.[1];

    if (fuzzyTopicIconId) {
      return fuzzyTopicIconId;
    }
  }

  return fallbackIconId;
};

export const isListIconId = (value: string): value is ListIconId => {
  return listIconIds.includes(value as ListIconId);
};
