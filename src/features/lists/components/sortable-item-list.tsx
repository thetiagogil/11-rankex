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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { RankBadge } from "@/features/lists/components/rank-badge";
import { TierBadge } from "@/features/lists/components/tier-badge";
import {
  deleteItemAction,
  reorderItemsAction,
} from "@/features/lists/server/actions";
import type { RankedItem } from "@/features/lists/types";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { cn } from "@/shared/utils/cn";

type SortableItemListProps = {
  canEdit: boolean;
  items: RankedItem[];
  listId: number;
};

export function SortableItemList({
  canEdit,
  items,
  listId,
}: SortableItemListProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [itemPendingDelete, setItemPendingDelete] = useState<RankedItem | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const sortableIds = useMemo(() => items.map((item) => item.id), [items]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextItems = arrayMove(items, oldIndex, newIndex);
    setFeedback(null);

    startTransition(async () => {
      const result = await reorderItemsAction(
        listId,
        nextItems.map((item) => item.id),
      );

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      router.refresh();
    });
  };

  const requestDeleteItem = (item: RankedItem) => {
    setFeedback(null);
    setItemPendingDelete(item);
  };

  const deleteItem = () => {
    if (!itemPendingDelete) return;

    const itemId = itemPendingDelete.id;
    setFeedback(null);
    startTransition(async () => {
      const result = await deleteItemAction(listId, itemId);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setItemPendingDelete(null);
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div className="sticker-card bg-card rounded-3xl border-dashed px-6 py-16 text-center">
        <p className="font-display text-xl">An empty podium awaits</p>
        <p className="text-muted-foreground mt-2 text-sm">
          {canEdit
            ? "Add the first contender to start the ranking."
            : "This list does not have items yet."}
        </p>
        {canEdit ? (
          <div className="mt-6">
            <ItemFormDialog listId={listId} />
          </div>
        ) : null}
      </div>
    );
  }

  const content = (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <SortableRow
          canEdit={canEdit}
          disabled={isPending}
          item={item}
          key={item.id}
          listId={listId}
          onDelete={requestDeleteItem}
          rank={index + 1}
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
          id={`rankex-sortable-${listId}`}
          onDragEnd={onDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            {content}
          </SortableContext>
        </DndContext>
      ) : (
        content
      )}
      <Modal
        description={
          itemPendingDelete
            ? `Delete ${itemPendingDelete.title} from this ranked list.`
            : undefined
        }
        onClose={() => setItemPendingDelete(null)}
        open={Boolean(itemPendingDelete)}
        title="Delete this item?"
      >
        <div className="flex flex-col gap-5 pt-5">
          <p className="text-muted-foreground text-sm leading-6">
            {itemPendingDelete
              ? `This permanently removes "${itemPendingDelete.title}" from the ranking.`
              : "This item will be removed from the ranking."}
          </p>
          <div className="border-border flex justify-end gap-2 border-t pt-4">
            <Button
              disabled={isPending}
              onClick={() => setItemPendingDelete(null)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} onClick={deleteItem} variant="danger">
              {isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Trash2 data-icon="inline-start" />
              )}
              Delete item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SortableRow({
  canEdit,
  disabled,
  item,
  listId,
  onDelete,
  rank,
}: {
  canEdit: boolean;
  disabled: boolean;
  item: RankedItem;
  listId: number;
  onDelete: (item: RankedItem) => void;
  rank: number;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ disabled: !canEdit || disabled, id: item.id });

  return (
    <article
      className={cn(
        "sticker-card group bg-card relative flex flex-col gap-3 rounded-3xl p-4 transition sm:flex-row sm:items-center",
        isDragging
          ? "border-primary ring-primary/35 z-30 ring-2"
          : "hover:border-primary",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center gap-3">
        {canEdit ? (
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
    </article>
  );
}
