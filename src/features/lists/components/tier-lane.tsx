"use client";

import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { SortableTierChip } from "@/features/lists/components/sortable-tier-chip";
import { TierBadge } from "@/features/lists/components/tier-badge";
import {
  getTierGroupDroppableId,
  getTierItemSortableId,
  untieredGroupId,
  type TierGroupId,
} from "@/features/lists/lib/tier-board";
import type { RankedItem } from "@/features/lists/types";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type TierLaneProps = {
  canEdit: boolean;
  disabled: boolean;
  groupId: TierGroupId;
  items: RankedItem[];
};

export function TierLane({ canEdit, disabled, groupId, items }: TierLaneProps) {
  const { isOver, setNodeRef } = useDroppable({
    data: { tierGroupId: groupId },
    disabled: !canEdit || disabled,
    id: getTierGroupDroppableId(groupId),
  });

  return (
    <Card
      as="section"
      className={cn(
        "grid grid-cols-[3.5rem_1fr] items-center gap-3 rounded-3xl p-3",
        isOver && "border-primary ring-primary/25 ring-2",
      )}
      ref={setNodeRef}
    >
      <div className="flex items-center justify-center">
        {groupId === untieredGroupId ? (
          <span className="text-muted-foreground text-xs font-semibold uppercase">
            No tier
          </span>
        ) : (
          <TierBadge size="lg" tier={groupId} />
        )}
      </div>

      <SortableContext
        items={items.map((item) => getTierItemSortableId(item.id))}
        strategy={rectSortingStrategy}
      >
        <div className="flex min-h-14 flex-wrap items-center gap-2">
          {items.length ? (
            items.map((item) => (
              <SortableTierChip
                disabled={!canEdit || disabled}
                groupId={groupId}
                item={item}
                key={item.id}
              />
            ))
          ) : (
            <span className="text-muted-foreground text-sm italic">Empty</span>
          )}
        </div>
      </SortableContext>
    </Card>
  );
}
