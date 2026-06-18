"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  deleteItemAction,
  reorderItemsAction,
} from "@/features/lists/server/actions";
import type { RankedItem } from "@/features/lists/types";

type UseSortableItemsOptions = {
  items: RankedItem[];
  listId: number;
};

export const useSortableItems = ({
  items,
  listId,
}: UseSortableItemsOptions) => {
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

  const cancelDeleteItem = () => {
    setItemPendingDelete(null);
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

  return {
    cancelDeleteItem,
    deleteItem,
    feedback,
    isPending,
    itemPendingDelete,
    onDragEnd,
    requestDeleteItem,
    sensors,
    sortableIds,
  };
};
