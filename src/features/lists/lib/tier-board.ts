import { TIERS, type Tier } from "@/features/lists/lib/tiers";
import type { RankedItem } from "@/features/lists/types";

export const untieredGroupId = "untiered";
export const tierItemIdPrefix = "tier-item:";
export const tierGroupIdPrefix = "tier-group:";

export type TierGroupId = Tier | typeof untieredGroupId;

export type TierReorderPayloadItem = {
  id: number;
  tier: Tier | null;
};

export type TierDragData = {
  itemId?: number;
  tierGroupId?: TierGroupId;
};

export const tierGroupIds = [
  ...TIERS,
  untieredGroupId,
] as const satisfies readonly TierGroupId[];

export const getTierGroupId = (tier: Tier | null): TierGroupId => {
  return tier ?? untieredGroupId;
};

export const getTierFromGroupId = (groupId: TierGroupId): Tier | null => {
  return groupId === untieredGroupId ? null : groupId;
};

export const getTierItemSortableId = (itemId: number) => {
  return `${tierItemIdPrefix}${itemId}`;
};

export const getTierGroupDroppableId = (groupId: TierGroupId) => {
  return `${tierGroupIdPrefix}${groupId}`;
};

export const parseTierItemSortableId = (value: string | number) => {
  if (typeof value === "number") return value;
  if (!value.startsWith(tierItemIdPrefix)) return null;

  const parsed = Number.parseInt(value.slice(tierItemIdPrefix.length), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

export const parseTierGroupDroppableId = (
  value: string | number,
): TierGroupId | null => {
  if (typeof value !== "string" || !value.startsWith(tierGroupIdPrefix)) {
    return null;
  }

  const groupId = value.slice(tierGroupIdPrefix.length);
  return isTierGroupId(groupId) ? groupId : null;
};

export const getTierGroupFromDragTarget = (
  overId: string | number,
  overData?: TierDragData,
): TierGroupId | null => {
  const tierGroupId = overData?.tierGroupId;

  if (isTierGroupId(tierGroupId)) {
    return tierGroupId;
  }

  return parseTierGroupDroppableId(overId);
};

export const isTierGroupId = (value: unknown): value is TierGroupId => {
  return (
    value === untieredGroupId ||
    (typeof value === "string" && TIERS.includes(value as Tier))
  );
};

export const getItemsForTierGroup = (
  items: RankedItem[],
  groupId: TierGroupId,
) => {
  return items.filter((item) => getTierGroupId(item.tier) === groupId);
};

export const getTierItemsSourceKey = (items: RankedItem[]) => {
  return items
    .map((item) => `${item.id}:${item.position}:${item.tier ?? "none"}`)
    .join("|");
};

export const reorderItemsForTierDrop = ({
  activeItemId,
  items,
  overGroupId,
  overItemId,
}: {
  activeItemId: number;
  items: RankedItem[];
  overGroupId: TierGroupId;
  overItemId: number | null;
}) => {
  const activeItem = items.find((item) => item.id === activeItemId);
  if (!activeItem) return items;

  const groups = new Map<TierGroupId, RankedItem[]>(
    tierGroupIds.map((groupId) => [
      groupId,
      items.filter(
        (item) =>
          item.id !== activeItemId && getTierGroupId(item.tier) === groupId,
      ),
    ]),
  );

  const targetItems = groups.get(overGroupId) ?? [];
  const overIndex =
    overItemId === null
      ? targetItems.length
      : targetItems.findIndex((item) => item.id === overItemId);
  const insertIndex = overIndex < 0 ? targetItems.length : overIndex;
  const movedItem = {
    ...activeItem,
    tier: getTierFromGroupId(overGroupId),
  };

  groups.set(overGroupId, [
    ...targetItems.slice(0, insertIndex),
    movedItem,
    ...targetItems.slice(insertIndex),
  ]);

  return tierGroupIds
    .flatMap((groupId) => groups.get(groupId) ?? [])
    .map((item, index) => ({ ...item, position: index + 1 }));
};

export const toTierReorderPayload = (
  items: RankedItem[],
): TierReorderPayloadItem[] => {
  return items.map((item) => ({
    id: item.id,
    tier: item.tier,
  }));
};
