"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import { type ReactNode } from "react";

import { TierLane } from "@/features/lists/components/tier-lane";
import { useTierReorder } from "@/features/lists/hooks/use-tier-reorder";
import { getItemsForTierGroup } from "@/features/lists/lib/tier-board";
import type { RankedItem } from "@/features/lists/types";
import { EmptyState } from "@/shared/components/empty-state";
import { Alert } from "@/shared/components/ui/alert";

type TierViewProps = {
  canEdit: boolean;
  emptyAction?: ReactNode;
  items: RankedItem[];
  listId: number;
};

export const TierView = ({
  canEdit,
  emptyAction,
  items,
  listId,
}: TierViewProps) => {
  const tierReorder = useTierReorder({ items, listId });

  if (items.length === 0) {
    return (
      <EmptyState
        action={emptyAction}
        description="Add your first contender to start ranking."
        title="An empty podium awaits"
      />
    );
  }

  const content = (
    <div className="flex flex-col gap-3">
      {tierReorder.visibleGroupIds.map((groupId) => (
        <TierLane
          canEdit={canEdit}
          disabled={tierReorder.isPending}
          groupId={groupId}
          items={getItemsForTierGroup(tierReorder.localItems, groupId)}
          key={groupId}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {tierReorder.feedback ? (
        <Alert tone="error">{tierReorder.feedback}</Alert>
      ) : null}
      {canEdit ? (
        <DndContext
          collisionDetection={closestCenter}
          id={`rankex-tier-sortable-${listId}`}
          onDragEnd={tierReorder.onDragEnd}
          sensors={tierReorder.sensors}
        >
          {content}
        </DndContext>
      ) : (
        content
      )}
    </div>
  );
};
