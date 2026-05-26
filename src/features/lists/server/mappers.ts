import { mapProfile } from "@/shared/server/mappers";
import type { ProfileRow } from "@/shared/types";
import type {
  ListComment,
  ListCommentRows,
  ListSocialState,
  RankingMode,
  RankedItem,
  RankedList,
  RankedListRows,
  RankedListSummary,
  RemixSource,
} from "@/features/lists/types";
import type { RankexListItemRow } from "@/types/database.types";

const defaultSocialState: ListSocialState = {
  bookmarkCount: 0,
  commentCount: 0,
  isBookmarkedByViewer: false,
  isLikedByViewer: false,
  likeCount: 0,
};

export function mapItem(row: RankexListItemRow): RankedItem {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    note: row.note,
    score: row.score,
    tier: row.tier,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapList(
  rows: RankedListRows,
  owner: ProfileRow | null,
  options: {
    comments?: ListCommentRows[];
    remixSource?: RemixSource | null;
    social?: ListSocialState;
  } = {},
): RankedList {
  const { list, items } = rows;

  return {
    id: list.id,
    ownerId: list.user_id,
    title: list.title,
    topic: list.topic,
    emoji: list.emoji,
    description: list.description,
    isPublic: list.is_public,
    rankingMode: list.ranking_mode,
    remixedFromListId: list.remixed_from_list_id,
    remixedFromUserId: list.remixed_from_user_id,
    createdAt: list.created_at,
    updatedAt: list.updated_at,
    owner: owner ? mapProfile(owner) : null,
    items: sortItemsForMode(items.map(mapItem), list.ranking_mode),
    remixSource: options.remixSource ?? null,
    social: options.social ?? defaultSocialState,
    comments: (options.comments ?? []).map(mapComment),
  };
}

export function mapListSummary(
  rows: RankedListRows,
  owner: ProfileRow | null,
  options: {
    remixSource?: RemixSource | null;
    social?: ListSocialState;
  } = {},
): RankedListSummary {
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
}

export function mapComment({ author, comment }: ListCommentRows): ListComment {
  return {
    author,
    body: comment.body,
    createdAt: comment.created_at,
    id: comment.id,
    listId: comment.list_id,
    updatedAt: comment.updated_at,
    userId: comment.user_id,
  };
}

function sortItemsForMode(items: RankedItem[], mode: RankingMode) {
  return [...items].sort((a, b) => {
    if (mode === "scored") return sortScoredItems(a, b);
    if (mode === "tiered") return sortTieredItems(a, b);
    return sortPositionedItems(a, b);
  });
}

function sortScoredItems(a: RankedItem, b: RankedItem) {
  const aScore = a.score ?? Number.NEGATIVE_INFINITY;
  const bScore = b.score ?? Number.NEGATIVE_INFINITY;
  return bScore - aScore || sortPositionedItems(a, b);
}

function sortTieredItems(a: RankedItem, b: RankedItem) {
  return getTierSortValue(a) - getTierSortValue(b) || sortPositionedItems(a, b);
}

function getTierSortValue(item: RankedItem) {
  if (item.tier === "S") return 0;
  if (item.tier === "A") return 1;
  if (item.tier === "B") return 2;
  if (item.tier === "C") return 3;
  if (item.tier === "D") return 4;
  return 5;
}

function sortPositionedItems(a: RankedItem, b: RankedItem) {
  return a.position - b.position || a.id - b.id;
}
