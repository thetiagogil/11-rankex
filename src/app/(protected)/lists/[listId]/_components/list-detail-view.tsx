"use client";

import {
  ArrowLeft,
  LayoutGrid,
  ListOrdered,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

type ListDetailViewProps = {
  currentUserId: string;
  list: RankedList;
};

type ViewMode = "ranked" | "tiers";

export function ListDetailView({ currentUserId, list }: ListDetailViewProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("ranked");
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

      <section className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="border-foreground/45 bg-gradient-gold shadow-elevated text-foreground grid size-16 shrink-0 rotate-[-5deg] place-items-center rounded-3xl border">
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

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-sm">
            <VisibilityBadge isPublic={list.isPublic} />
            <span>{list.topic ?? "General"}</span>
            <span>
              {list.items.length}{" "}
              {list.items.length === 1 ? "entry" : "entries"}
            </span>
            {canEdit ? <span>drag to reorder</span> : null}
            {list.owner ? (
              <span>
                by{" "}
                <span className="text-foreground">
                  {list.owner.displayName}
                </span>
                {list.owner.username ? ` @${list.owner.username}` : ""}
              </span>
            ) : null}
            {list.remixSource ? (
              <span>
                remixed from{" "}
                <Link
                  className="text-foreground hover:text-primary transition"
                  href={`/lists/${list.remixSource.id}`}
                >
                  {list.remixSource.title}
                </Link>
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            aria-label="Choose list view"
            className="border-foreground/45 bg-card h-10 overflow-hidden rounded-xl border"
            onValueChange={(value) => {
              if (value) setView(value as ViewMode);
            }}
            spacing={0}
            type="single"
            value={view}
          >
            <ToggleGroupItem
              className="text-muted-foreground hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background h-10 rounded-xl px-3 text-sm font-bold"
              value="ranked"
            >
              <ListOrdered data-icon="inline-start" />
              Ranked
            </ToggleGroupItem>
            <ToggleGroupItem
              className="text-muted-foreground hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background h-10 rounded-xl px-3 text-sm font-bold"
              value="tiers"
            >
              <LayoutGrid data-icon="inline-start" />
              Tiers
            </ToggleGroupItem>
          </ToggleGroup>
          {list.isPublic ? (
            <ListSocialActions
              canRemix={!canEdit}
              listId={list.id}
              showLabels
              social={list.social}
            />
          ) : null}
          {canEdit ? (
            <>
              <ItemFormDialog
                listId={list.id}
                trigger={
                  <Button size="lg">
                    <Plus data-icon="inline-start" />
                    Add item
                  </Button>
                }
              />
              <ListFormDialog
                initialList={list}
                trigger={
                  <Button size="lg" variant="outline">
                    <Pencil data-icon="inline-start" />
                    Edit
                  </Button>
                }
              />
              <Button
                aria-label={`Delete ${list.title}`}
                disabled={isPending}
                onClick={() => setDeleteDialogOpen(true)}
                size="icon-lg"
                variant="ghost"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 className="text-destructive" />
                )}
              </Button>
            </>
          ) : null}
        </div>
      </section>

      <Modal
        description={`Delete ${list.title} and all ranked items.`}
        onClose={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
        title="Delete this list?"
      >
        <div className="flex flex-col gap-5 pt-5">
          <p className="text-muted-foreground text-sm leading-6">
            This permanently deletes &quot;{list.title}&quot; and all ranked
            items in it.
          </p>
          <div className="border-border flex justify-end gap-2 border-t border-dashed pt-4">
            <Button
              disabled={isPending}
              onClick={() => setDeleteDialogOpen(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} onClick={deleteList} variant="danger">
              {isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Trash2 data-icon="inline-start" />
              )}
              Delete list
            </Button>
          </div>
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
          <TierView items={list.items} />
        )}
      </section>

      <CommentSection currentUserId={currentUserId} list={list} />
    </AppMain>
  );
}
