"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Pencil, Trash2 } from "lucide-react";

import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { RankBadge } from "@/features/lists/components/rank-badge";
import { TierBadge } from "@/features/lists/components/tier-badge";
import type { RankedItem, RankingMode } from "@/features/lists/types";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type SortableItemRowProps = {
  canEdit: boolean;
  canReorder: boolean;
  disabled: boolean;
  item: RankedItem;
  listId: number;
  onDelete: (item: RankedItem) => void;
  rank: number;
  rankingMode: RankingMode;
};

export function SortableItemRow({
  canEdit,
  canReorder,
  disabled,
  item,
  listId,
  onDelete,
  rank,
  rankingMode,
}: SortableItemRowProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ disabled: !canReorder || disabled, id: item.id });

  return (
    <Card
      as="article"
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl p-4 transition sm:flex-row sm:items-center",
        isDragging
          ? "border-primary ring-primary/35 z-30 ring-2"
          : "hover:border-primary",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      variant="shadow"
    >
      <div className="flex items-center gap-3">
        {canReorder ? (
          <Button
            aria-label="Drag to reorder"
            className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
            disabled={disabled}
            size="icon"
            type="button"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            {disabled ? <Loader2 className="animate-spin" /> : <GripVertical />}
          </Button>
        ) : null}
        <RankBadge rank={rank} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display truncate text-lg font-semibold">
            {item.title}
          </h3>
          {item.score !== null ? (
            <span className="border-foreground/45 bg-accent text-accent-foreground rounded-lg border px-2 py-0.5 font-mono text-xs font-bold shadow-none">
              {item.score}
            </span>
          ) : null}
        </div>
        {item.note ? (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-6">
            {item.note}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        {item.tier ? <TierBadge tier={item.tier} /> : null}
        {canEdit ? (
          <div className="flex items-center gap-1">
            <ItemFormDialog
              item={item}
              listId={listId}
              rankingMode={rankingMode}
              trigger={
                <Button
                  aria-label={`Edit ${item.title}`}
                  size="icon"
                  variant="ghost"
                >
                  <Pencil />
                </Button>
              }
            />
            <Button
              aria-label={`Delete ${item.title}`}
              onClick={() => onDelete(item)}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
