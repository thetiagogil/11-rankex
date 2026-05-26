"use client";

import { ArrowLeft, LayoutGrid, List, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ListOwnerMetadata } from "@/app/(protected)/lists/[listId]/_components/list-owner-metadata";
import type { ListDetailViewMode } from "@/app/(protected)/lists/[listId]/_types";
import { ItemFormDialog } from "@/features/lists/components/item-form-dialog";
import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import { SortableItemList } from "@/features/lists/components/sortable-item-list";
import { TierView } from "@/features/lists/components/tier-view";
import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import { getListIcon } from "@/features/lists/lib/list-icons";
import { deleteListAction } from "@/features/lists/server/actions";
import type { RankedList } from "@/features/lists/types";
import { CommentSection } from "@/features/social/components/comment-section";
import { ListSocialActions } from "@/features/social/components/list-social-actions";
import { AppMain } from "@/shared/components/layout/app-main";
import { MetadataDot } from "@/shared/components/metadata-dot";
import { Modal } from "@/shared/components/modal";
import {
  SegmentedToggleGroup,
  SegmentedToggleGroupItem,
} from "@/shared/components/segmented-toggle-group";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

type ListDetailViewProps = {
  currentUserId: string;
  list: RankedList;
};

export function ListDetailView({ currentUserId, list }: ListDetailViewProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [view, setView] = useState<ListDetailViewMode>("ranked");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canEdit = list.ownerId === currentUserId;
  const listIcon = getListIcon(list.emoji, list.topic);
  const Icon = listIcon.Icon;

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

      <section className="mt-6">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="border-foreground/45 bg-gradient-gold shadow-elevated text-foreground grid size-16 shrink-0 place-items-center rounded-3xl border">
              <Icon aria-hidden="true" className="size-8" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-5xl leading-none font-black sm:text-6xl">
                {list.title}
              </h1>
            </div>
          </div>

          {list.description ? (
            <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-7">
              {list.description}
            </p>
          ) : null}

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
            {list.owner ? (
              <>
                <ListOwnerMetadata profile={list.owner} />
                <MetadataDot />
              </>
            ) : null}
            <span>{list.topic ?? "General"}</span>
            <MetadataDot />
            <span>
              {list.items.length}{" "}
              {list.items.length === 1 ? "entry" : "entries"}
            </span>
            {list.remixSource ? (
              <>
                <MetadataDot />
                <span>
                  remixed from{" "}
                  <Link
                    className="text-foreground hover:text-primary transition"
                    href={`/lists/${list.remixSource.id}`}
                  >
                    {list.remixSource.title}
                  </Link>
                </span>
              </>
            ) : null}
            {canEdit ? (
              <>
                <MetadataDot />
                <VisibilityBadge isPublic={list.isPublic} />
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedToggleGroup
              aria-label="Choose list view"
              onValueChange={(value) => {
                if (value) setView(value as ListDetailViewMode);
              }}
              type="single"
              value={view}
            >
              <SegmentedToggleGroupItem
                className="gap-1.5 px-2.5"
                labelStyle="plain"
                value="ranked"
              >
                <List data-icon="inline-start" />
                Ranked
              </SegmentedToggleGroupItem>
              <SegmentedToggleGroupItem
                className="gap-1.5 px-2.5"
                labelStyle="plain"
                value="tiers"
              >
                <LayoutGrid data-icon="inline-start" />
                Tiers
              </SegmentedToggleGroupItem>
            </SegmentedToggleGroup>

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
                onRequestDelete={() => setDeleteDialogOpen(true)}
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
                trigger={
                  <Button aria-label="Add item" size="icon-lg" title="Add item">
                    <Plus />
                  </Button>
                }
              />
            </div>
          ) : null}
        </div>
      </section>

      <Modal
        description={`Delete ${list.title} and all ranked items.`}
        footer={
          <>
            <Button
              disabled={isPending}
              onClick={() => setDeleteDialogOpen(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} onClick={deleteList} variant="danger">
              {isPending ? "Deleting..." : "Delete list"}
            </Button>
          </>
        }
        onClose={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
        title="Delete this list?"
      >
        <div className="flex flex-col gap-5">
          <p className="text-muted-foreground text-sm leading-6">
            This permanently deletes &quot;{list.title}&quot; and all ranked
            items in it.
          </p>
        </div>
      </Modal>

      {feedback ? (
        <div className="mt-4">
          <Alert tone="error">{feedback}</Alert>
        </div>
      ) : null}

      <section className="mt-8">
        {view === "ranked" ? (
          <SortableItemList
            canEdit={canEdit}
            items={list.items}
            listId={list.id}
          />
        ) : (
          <TierView
            emptyAction={
              canEdit ? <ItemFormDialog listId={list.id} /> : undefined
            }
            items={list.items}
          />
        )}
      </section>

      <CommentSection currentUserId={currentUserId} list={list} />
    </AppMain>
  );
}
