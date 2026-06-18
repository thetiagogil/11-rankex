"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  getItemsForTierGroup,
  getTierGroupFromDragTarget,
  getTierItemsSourceKey,
  parseTierItemSortableId,
  reorderItemsForTierDrop,
  tierGroupIds,
  toTierReorderPayload,
  untieredGroupId,
  type TierDragData,
} from "@/features/lists/lib/tier-board";
import { reorderItemsWithTiersAction } from "@/features/lists/server/actions";
import type { RankedItem } from "@/features/lists/types";

type UseTierReorderOptions = {
  items: RankedItem[];
  listId: number;
};

type OptimisticTierItems = {
  items: RankedItem[];
  sourceKey: string;
};

export const useTierReorder = ({ items, listId }: UseTierReorderOptions) => {
  const router = useRouter();
  const sourceKey = useMemo(() => getTierItemsSourceKey(items), [items]);
  const [optimisticItems, setOptimisticItems] =
    useState<OptimisticTierItems | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const localItems =
    optimisticItems?.sourceKey === sourceKey ? optimisticItems.items : items;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const visibleGroupIds = tierGroupIds.filter(
    (groupId) =>
      groupId !== untieredGroupId ||
      getItemsForTierGroup(localItems, groupId).length > 0,
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItemId = parseTierItemSortableId(active.id);
    const overData = over.data.current as TierDragData | undefined;
    const overItemId =
      typeof overData?.itemId === "number"
        ? overData.itemId
        : parseTierItemSortableId(over.id);
    const overGroupId = getTierGroupFromDragTarget(over.id, overData);

    if (!activeItemId || !overGroupId) return;

    const nextItems = reorderItemsForTierDrop({
      activeItemId,
      items: localItems,
      overGroupId,
      overItemId,
    });

    setFeedback(null);
    setOptimisticItems({ items: nextItems, sourceKey });

    startTransition(async () => {
      const result = await reorderItemsWithTiersAction(
        listId,
        toTierReorderPayload(nextItems),
      );

      if (!result.ok) {
        setOptimisticItems(null);
        setFeedback(result.error);
        return;
      }

      router.refresh();
    });
  };

  return {
    feedback,
    isPending,
    localItems,
    onDragEnd,
    sensors,
    visibleGroupIds,
  };
};
