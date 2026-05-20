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
import { deleteListAction } from "@/features/lists/server/actions";
import type { RankedList } from "@/features/lists/types";
import { AppMain } from "@/shared/components/layout/app-main";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type ListDetailViewProps = {
  currentUserId: string;
  list: RankedList;
};

type ViewMode = "ranked" | "tiers";

export function ListDetailView({ currentUserId, list }: ListDetailViewProps) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("ranked");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canEdit = list.ownerId === currentUserId;

  const deleteList = () => {
    if (!window.confirm(`Delete "${list.title}" and all of its items?`)) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await deleteListAction(list.id);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <AppMain className="max-w-5xl pb-16">
      <Link
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
        href="/dashboard"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <section className="mt-6">
        <Card as="section" className="p-5 sm:p-6" gradient tone="primary">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <span className="border-primary/30 bg-primary/10 grid h-14 w-14 shrink-0 place-items-center rounded-lg border text-3xl">
                  {list.emoji ?? "#"}
                </span>
                <div className="min-w-0">
                  <p className="text-secondary font-mono text-[10px] tracking-[0.25em] uppercase">
                    {list.topic ?? "General"}
                  </p>
                  <h1 className="font-display mt-2 text-4xl leading-tight font-black sm:text-5xl">
                    {list.title}
                  </h1>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <VisibilityBadge isPublic={list.isPublic} />
                <span className="text-muted-foreground text-sm">
                  {list.items.length}{" "}
                  {list.items.length === 1 ? "ranked item" : "ranked items"}
                </span>
                {list.owner ? (
                  <span className="text-muted-foreground text-sm">
                    by {list.owner.displayName}
                    {list.owner.username ? ` @${list.owner.username}` : ""}
                  </span>
                ) : null}
              </div>

              {list.description ? (
                <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
                  {list.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SegmentedButton
                active={view === "ranked"}
                icon={<ListOrdered className="h-4 w-4" />}
                label="Ranked"
                onClick={() => setView("ranked")}
              />
              <SegmentedButton
                active={view === "tiers"}
                icon={<LayoutGrid className="h-4 w-4" />}
                label="Tiers"
                onClick={() => setView("tiers")}
              />
              {canEdit ? (
                <>
                  <ItemFormDialog
                    listId={list.id}
                    trigger={
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                        Add item
                      </Button>
                    }
                  />
                  <ListFormDialog
                    initialList={list}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    }
                  />
                  <Button
                    disabled={isPending}
                    onClick={deleteList}
                    size="icon"
                    variant="danger"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </Card>
      </section>

      {feedback ? (
        <div className="mt-4">
          <Alert tone="error">{feedback}</Alert>
        </div>
      ) : null}

      <section className="mt-6">
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
        "border-border bg-card hover:bg-surface inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition",
        active && "border-primary bg-primary/10 text-primary",
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
