import type {
  ExplorePersonCard,
  ExplorePersonStats,
  ExploreSort,
} from "@/app/(protected)/explore/_types";
import type { RankedListSummary } from "@/features/lists/types";
import type { Profile } from "@/shared/types";

export function buildExplorePeople(
  lists: RankedListSummary[],
  profiles: Profile[],
  currentUserId: string,
) {
  const listsByProfileId = new Map<string, RankedListSummary[]>();

  for (const list of lists) {
    if (!list.owner) continue;

    const ownerLists = listsByProfileId.get(list.owner.id) ?? [];
    ownerLists.push(list);
    listsByProfileId.set(list.owner.id, ownerLists);
  }

  return profiles
    .filter((profile) => profile.id !== currentUserId)
    .map((profile) => ({
      profile,
      stats: buildExplorePersonStats(listsByProfileId.get(profile.id) ?? []),
    }));
}

export function filterExplorePeople(
  people: ExplorePersonCard[],
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return people;

  return people.filter(({ profile, stats }) =>
    [profile.displayName, profile.username, ...stats.topics]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function filterAndSortExploreLists({
  followingIds,
  lists,
  query,
  sort,
}: {
  followingIds: string[];
  lists: RankedListSummary[];
  query: string;
  sort: ExploreSort;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = lists.filter((list) => {
    const matchesQuery =
      !normalizedQuery ||
      [list.title, list.topic]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesQuery;
  });

  const scoped =
    sort === "following"
      ? filtered.filter((list) => followingIds.includes(list.ownerId))
      : filtered;

  return [...scoped].sort((a, b) => {
    if (sort === "newest" || sort === "following") {
      return b.updatedAt.localeCompare(a.updatedAt);
    }

    return (
      b.social.likeCount +
        b.social.commentCount -
        (a.social.likeCount + a.social.commentCount) ||
      b.updatedAt.localeCompare(a.updatedAt)
    );
  });
}

function buildExplorePersonStats(
  lists: RankedListSummary[],
): ExplorePersonStats {
  return {
    likeCount: lists.reduce((sum, list) => sum + list.social.likeCount, 0),
    publicListCount: lists.length,
    topics: Array.from(
      new Set(lists.map((list) => list.topic).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b)),
  };
}
