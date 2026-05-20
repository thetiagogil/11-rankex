import { mapProfile } from "@/shared/server/mappers";
import type { ProfileRow } from "@/shared/types";
import type {
  RankedItem,
  RankedList,
  RankedListRows,
  RankedListSummary,
} from "@/features/lists/types";
import type { RankexListItemRow } from "@/types/database.types";

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
    createdAt: list.created_at,
    updatedAt: list.updated_at,
    owner: owner ? mapProfile(owner) : null,
    items: items.map(mapItem).sort(sortItems),
  };
}

export function mapListSummary(
  rows: RankedListRows,
  owner: ProfileRow | null,
): RankedListSummary {
  const list = mapList(rows, owner);

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

function sortItems(a: RankedItem, b: RankedItem) {
  return a.position - b.position || a.id - b.id;
}
