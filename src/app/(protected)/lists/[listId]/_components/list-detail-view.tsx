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
import { getListEmoji } from "@/features/lists/lib/list-emoji";
import { deleteListAction } from "@/features/lists/server/actions";
import type { RankedList } from "@/features/lists/types";
import { AppMain } from "@/shared/components/layout/app-main";
import { Alert } from "@/shared/components/ui/alert";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { cn } from "@/shared/utils/cn";

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
  const emoji = getListEmoji(list.emoji, list.topic);

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
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        href="/dashboard"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <section className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="text-5xl leading-none">{emoji}</div>
            <div className="min-w-0">
              <span className="font-mono text-xs tracking-widest text-primary uppercase">
                {list.topic ?? "General"}
              </span>
              <h1 className="mt-1 font-display text-4xl leading-tight font-black sm:text-5xl">
                {list.title}
              </h1>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <VisibilityBadge isPublic={list.isPublic} />
            <span>
              {list.items.length}{" "}
              {list.items.length === 1 ? "entry" : "entries"}
            </span>
            {canEdit ? <span>drag to reorder</span> : null}
            {list.owner ? (
              <span>
                by <span className="text-foreground">{list.owner.displayName}</span>
                {list.owner.username ? ` @${list.owner.username}` : ""}
              </span>
            ) : null}
          </div>

          {list.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {list.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-border bg-card p-1">
            <SegmentedButton
              active={view === "ranked"}
              icon={<ListOrdered />}
              label="Ranked"
              onClick={() => setView("ranked")}
            />
            <SegmentedButton
              active={view === "tiers"}
              icon={<LayoutGrid />}
              label="Tiers"
              onClick={() => setView("tiers")}
            />
          </div>
          {canEdit ? (
            <>
              <ItemFormDialog
                listId={list.id}
                trigger={
                  <Button size="sm">
                    <Plus data-icon="inline-start" />
                    Add item
                  </Button>
                }
              />
              <ListFormDialog
                initialList={list}
                trigger={
                  <Button size="sm" variant="outline">
                    <Pencil data-icon="inline-start" />
                    Edit
                  </Button>
                }
              />
              <button
                aria-label={`Delete ${list.title}`}
                className={buttonVariants({ size: "icon", variant: "ghost" })}
                disabled={isPending}
                onClick={() => setDeleteDialogOpen(true)}
                type="button"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 className="text-destructive" />
                )}
              </button>
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
          <p className="text-sm leading-6 text-muted-foreground">
            This permanently deletes &quot;{list.title}&quot; and all ranked items
            in it.
          </p>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
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
    </AppMain>
  );
}

function SegmentedButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground [&_svg]:size-4",
        active && "bg-secondary text-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
