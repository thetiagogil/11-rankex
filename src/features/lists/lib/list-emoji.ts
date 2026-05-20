const topicEmojiMap: Record<string, string> = {
  books: "📚",
  food: "☕",
  games: "🎮",
  movies: "🎬",
  music: "🎵",
  sports: "⚽",
  travel: "✈️",
  work: "💻",
};

const fallbackEmoji = "🏆";

export function getListEmoji(emoji: string | null, topic: string | null) {
  if (emoji && !isDamagedEmoji(emoji)) {
    return emoji;
  }

  const normalizedTopic = topic?.trim().toLowerCase();

  if (normalizedTopic && normalizedTopic in topicEmojiMap) {
    return topicEmojiMap[normalizedTopic];
  }

  return fallbackEmoji;
}

function isDamagedEmoji(value: string) {
  const trimmed = value.trim();

  return (
    trimmed.length === 0 ||
    trimmed === "?" ||
    trimmed === "??" ||
    trimmed.includes("�") ||
    /^[?]+$/.test(trimmed)
  );
}
