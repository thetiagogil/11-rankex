"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DeleteListDialog } from "@/app/(protected)/lists/[listId]/_components/delete-list-dialog";
import { ListDetailHeader } from "@/app/(protected)/lists/[listId]/_components/list-detail-header";
import { ListDetailToolbar } from "@/app/(protected)/lists/[listId]/_components/list-detail-toolbar";
import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { SortableItemList } from "@/features/lists/components/sortable-item-list";
import { TierView } from "@/features/lists/components/tier-view";
import { deleteListAction } from "@/features/lists/server/actions";
import type { RankedList } from "@/features/lists/types";
import { CommentSection } from "@/features/social/components/comment-section";
import { AppMain } from "@/shared/components/layout/app-main";
import { Alert } from "@/shared/components/ui/alert";

type ListDetailViewProps = {
  currentUserId: string;
  list: RankedList;
};

export function ListDetailView({ currentUserId, list }: ListDetailViewProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canEdit = list.ownerId === currentUserId;
  const isTieredList = list.rankingMode === "tiered";

  const deleteList = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await deleteListAction(list.id);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setDeleteDialogOpen(false);
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <AppMain className="max-w-4xl pb-20">
      <Link
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition"
        href="/dashboard"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <ListDetailHeader canEdit={canEdit} list={list} />

      <ListDetailToolbar
        canEdit={canEdit}
        list={list}
        onRequestDelete={() => setDeleteDialogOpen(true)}
      />

      <DeleteListDialog
        isPending={isPending}
        listTitle={list.title}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={deleteList}
        open={deleteDialogOpen}
      />

      {feedback ? (
        <div className="mt-4">
          <Alert tone="error">{feedback}</Alert>
        </div>
      ) : null}

      <section className="mt-8">
        {isTieredList ? (
          <TierView
            canEdit={canEdit}
            emptyAction={
              canEdit ? (
                <ItemFormDialog
                  listId={list.id}
                  rankingMode={list.rankingMode}
                />
              ) : undefined
            }
            items={list.items}
            listId={list.id}
          />
        ) : (
          <SortableItemList
            canEdit={canEdit}
            canReorder={canEdit && list.rankingMode === "ranked"}
            items={list.items}
            listId={list.id}
            rankingMode={list.rankingMode}
          />
        )}
      </section>

      <CommentSection currentUserId={currentUserId} list={list} />
    </AppMain>
  );
}
