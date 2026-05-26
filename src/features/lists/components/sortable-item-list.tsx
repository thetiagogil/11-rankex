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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { SortableItemRow } from "@/features/lists/components/sortable-item-row";
import {
  deleteItemAction,
  reorderItemsAction,
} from "@/features/lists/server/actions";
import type { RankedItem } from "@/features/lists/types";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/empty-state";
import { Modal } from "@/shared/components/modal";

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
      <EmptyState
        action={canEdit ? <ItemFormDialog listId={listId} /> : null}
        description={
          canEdit
            ? "Add your first contender to start ranking."
            : "This list does not have items yet."
        }
        title="An empty podium awaits"
      />
    );
  }

  const content = (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <SortableItemRow
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
        footer={
          <>
            <Button
              disabled={isPending}
              onClick={() => setItemPendingDelete(null)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} onClick={deleteItem} variant="danger">
              {isPending ? "Deleting..." : "Delete item"}
            </Button>
          </>
        }
        onClose={() => setItemPendingDelete(null)}
        open={Boolean(itemPendingDelete)}
        title="Delete this item?"
      >
        <div className="flex flex-col gap-5">
          <p className="text-muted-foreground text-sm leading-6">
            {itemPendingDelete
              ? `This permanently removes "${itemPendingDelete.title}" from the ranking.`
              : "This item will be removed from the ranking."}
          </p>
        </div>
      </Modal>
    </div>
  );
}
