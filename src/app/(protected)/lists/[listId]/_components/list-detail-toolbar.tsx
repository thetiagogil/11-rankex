"use client";

import { Pencil, Plus } from "lucide-react";

import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import type { RankedList } from "@/features/lists/types";
import { ListSocialActions } from "@/features/social/components/list-social-actions";
import { Button } from "@/shared/components/ui/button";

type ListDetailToolbarProps = {
  canEdit: boolean;
  list: RankedList;
  onRequestDelete: () => void;
};

export const ListDetailToolbar = ({
  canEdit,
  list,
  onRequestDelete,
}: ListDetailToolbarProps) => {
  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {list.isPublic ? (
          <ListSocialActions
            canRemix={!canEdit}
            listId={list.id}
            social={list.social}
          />
        ) : null}
      </div>

      {canEdit ? (
        <div className="flex flex-wrap items-center gap-3">
          <ListFormDialog
            initialList={list}
            onRequestDelete={onRequestDelete}
            trigger={
              <Button
                aria-label="Edit list"
                size="icon-lg"
                title="Edit list"
                variant="outline"
              >
                <Pencil />
              </Button>
            }
          />
          <ItemFormDialog
            listId={list.id}
            rankingMode={list.rankingMode}
            trigger={
              <Button aria-label="Add item" size="icon-lg" title="Add item">
                <Plus />
              </Button>
            }
          />
        </div>
      ) : null}
    </div>
  );
};
