"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo, useState, useTransition } from "react";

import { TierLane } from "@/features/lists/components/tier-lane";
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
import { EmptyState } from "@/shared/components/empty-state";
import { Alert } from "@/shared/components/ui/alert";

type TierViewProps = {
  canEdit: boolean;
  emptyAction?: ReactNode;
  items: RankedItem[];
  listId: number;
};

type OptimisticTierItems = {
  items: RankedItem[];
  sourceKey: string;
};

export function TierView({
  canEdit,
  emptyAction,
  items,
  listId,
}: TierViewProps) {
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

  if (items.length === 0) {
    return (
      <EmptyState
        action={emptyAction}
        description="Add your first contender to start ranking."
        title="An empty podium awaits"
      />
    );
  }

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

  const content = (
    <div className="flex flex-col gap-3">
      {tierGroupIds
        .filter(
          (groupId) =>
            groupId !== untieredGroupId ||
            getItemsForTierGroup(localItems, groupId).length > 0,
        )
        .map((groupId) => (
          <TierLane
            canEdit={canEdit}
            disabled={isPending}
            groupId={groupId}
            items={getItemsForTierGroup(localItems, groupId)}
            key={groupId}
          />
        ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {feedback ? <Alert tone="error">{feedback}</Alert> : null}
      {canEdit ? (
        <DndContext
          collisionDetection={closestCenter}
          id={`rankex-tier-sortable-${listId}`}
          onDragEnd={onDragEnd}
          sensors={sensors}
        >
          {content}
        </DndContext>
      ) : (
        content
      )}
    </div>
  );
}
