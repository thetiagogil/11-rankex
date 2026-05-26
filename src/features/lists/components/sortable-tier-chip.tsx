"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  getTierItemSortableId,
  type TierGroupId,
} from "@/features/lists/lib/tier-board";
import type { RankedItem } from "@/features/lists/types";
import { cn } from "@/shared/utils/cn";

type SortableTierChipProps = {
  disabled: boolean;
  groupId: TierGroupId;
  item: RankedItem;
};

export function SortableTierChip({
  disabled,
  groupId,
  item,
}: SortableTierChipProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    data: { itemId: item.id, tierGroupId: groupId },
    disabled,
    id: getTierItemSortableId(item.id),
  });
  const dragAttributes = disabled ? {} : attributes;
  const dragListeners = disabled ? {} : listeners;

  return (
    <button
      aria-label={disabled ? undefined : `Drag ${item.title}`}
      aria-disabled={disabled}
      className={cn(
        "border-foreground/45 bg-secondary inline-flex touch-none items-center rounded-xl border px-3 py-2 text-left text-sm font-semibold shadow-none transition",
        disabled
          ? "cursor-default"
          : "cursor-grab hover:border-primary active:cursor-grabbing",
        isDragging && "border-primary opacity-70 ring-2 ring-primary/30",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      tabIndex={disabled ? -1 : 0}
      type="button"
      {...dragAttributes}
      {...dragListeners}
    >
      {item.title}
    </button>
  );
}
