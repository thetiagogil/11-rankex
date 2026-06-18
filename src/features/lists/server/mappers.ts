import { mapProfile } from "@/shared/server/mappers";
import type { ProfileRow } from "@/shared/types";
import { normalizeRankingMode } from "@/features/lists/lib/ranking-mode";
import { isTier } from "@/features/lists/lib/tiers";
import type {
  ListComment,
  ListCommentRows,
  ListSocialState,
  RankexListItemRow,
  RankingMode,
  RankedItem,
  RankedList,
  RankedListRows,
  RankedListSummary,
  RemixSource,
  Tier,
} from "@/features/lists/types";

const defaultSocialState: ListSocialState = {
  bookmarkCount: 0,
  commentCount: 0,
  isBookmarkedByViewer: false,
  isLikedByViewer: false,
  likeCount: 0,
};

export const mapItem = (row: RankexListItemRow): RankedItem => {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    note: row.note,
    score: row.score,
    tier: mapTier(row.tier),
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const mapList = (
  rows: RankedListRows,
  owner: ProfileRow | null,
  options: {
    comments?: ListCommentRows[];
    remixSource?: RemixSource | null;
    social?: ListSocialState;
  } = {},
): RankedList => {
  const { list, items } = rows;
  const rankingMode = normalizeRankingMode(list.ranking_mode);

  return {
    id: list.id,
    ownerId: list.user_id,
    title: list.title,
    topic: list.topic,
    emoji: list.emoji,
    description: list.description,
    isPublic: list.is_public,
    rankingMode,
    remixedFromListId: list.remixed_from_list_id,
    remixedFromUserId: list.remixed_from_user_id,
    createdAt: list.created_at,
    updatedAt: list.updated_at,
    owner: owner ? mapProfile(owner) : null,
    items: sortItemsForMode(items.map(mapItem), rankingMode),
    remixSource: options.remixSource ?? null,
    social: options.social ?? defaultSocialState,
    comments: (options.comments ?? []).map(mapComment),
  };
};

export const mapListSummary = (
  rows: RankedListRows,
  owner: ProfileRow | null,
  options: {
    remixSource?: RemixSource | null;
    social?: ListSocialState;
  } = {},
): RankedListSummary => {
  const list = mapList(rows, owner, options);

  return {
    ...list,
    itemCount: list.items.length,
    topItems: list.items.slice(0, 5).map((item) => ({
      id: item.id,
      position: item.position,
      title: item.title,
    })),
  };
};

export const mapComment = ({
  author,
  comment,
}: ListCommentRows): ListComment => {
  return {
    author,
    body: comment.body,
    createdAt: comment.created_at,
    id: comment.id,
    listId: comment.list_id,
    updatedAt: comment.updated_at,
    userId: comment.user_id,
  };
};

const sortItemsForMode = (items: RankedItem[], mode: RankingMode) => {
  return [...items].sort((a, b) => {
    if (mode === "scored") return sortScoredItems(a, b);
    if (mode === "tiered") return sortTieredItems(a, b);
    return sortPositionedItems(a, b);
  });
};

const sortScoredItems = (a: RankedItem, b: RankedItem) => {
  const aScore = a.score ?? Number.NEGATIVE_INFINITY;
  const bScore = b.score ?? Number.NEGATIVE_INFINITY;
  return bScore - aScore || sortPositionedItems(a, b);
};

const sortTieredItems = (a: RankedItem, b: RankedItem) => {
  return getTierSortValue(a) - getTierSortValue(b) || sortPositionedItems(a, b);
};

const getTierSortValue = (item: RankedItem) => {
  if (item.tier === "S") return 0;
  if (item.tier === "A") return 1;
  if (item.tier === "B") return 2;
  if (item.tier === "C") return 3;
  if (item.tier === "D") return 4;
  return 5;
};

const sortPositionedItems = (a: RankedItem, b: RankedItem) => {
  return a.position - b.position || a.id - b.id;
};

const mapTier = (value: string | null): Tier | null => {
  if (!value) return null;

  return isTier(value) ? value : null;
};
