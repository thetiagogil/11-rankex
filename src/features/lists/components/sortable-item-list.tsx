"use client";

import {
  closestCenter,
  DndContext,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { DeleteItemDialog } from "@/features/lists/components/delete-item-dialog";
import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { SortableItemRow } from "@/features/lists/components/sortable-item-row";
import { useSortableItems } from "@/features/lists/hooks/use-sortable-items";
import type { RankedItem, RankingMode } from "@/features/lists/types";
import { Alert } from "@/shared/components/ui/alert";
import { EmptyState } from "@/shared/components/empty-state";

type SortableItemListProps = {
  canEdit: boolean;
  canReorder: boolean;
  items: RankedItem[];
  listId: number;
  rankingMode: RankingMode;
};

export function SortableItemList({
  canEdit,
  canReorder,
  items,
  listId,
  rankingMode,
}: SortableItemListProps) {
  const sortable = useSortableItems({ items, listId });

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          canEdit ? (
            <ItemFormDialog listId={listId} rankingMode={rankingMode} />
          ) : null
        }
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
          canReorder={canReorder}
          disabled={sortable.isPending}
          item={item}
          key={item.id}
          listId={listId}
          onDelete={sortable.requestDeleteItem}
          rank={index + 1}
          rankingMode={rankingMode}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {sortable.feedback ? (
        <Alert tone="error">{sortable.feedback}</Alert>
      ) : null}
      {canReorder ? (
        <DndContext
          collisionDetection={closestCenter}
          id={`rankex-sortable-${listId}`}
          onDragEnd={sortable.onDragEnd}
          sensors={sortable.sensors}
        >
          <SortableContext
            items={sortable.sortableIds}
            strategy={verticalListSortingStrategy}
          >
            {content}
          </SortableContext>
        </DndContext>
      ) : (
        content
      )}
      <DeleteItemDialog
        isPending={sortable.isPending}
        itemTitle={sortable.itemPendingDelete?.title}
        onCancel={sortable.cancelDeleteItem}
        onConfirm={sortable.deleteItem}
        open={Boolean(sortable.itemPendingDelete)}
      />
    </div>
  );
}
