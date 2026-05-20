import { ArrowUpRight, ListOrdered } from "lucide-react";
import Link from "next/link";

import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import type { RankedListSummary } from "@/features/lists/types";
import { Card } from "@/shared/components/ui/card";

type ListCardProps = {
  list: RankedListSummary;
  showOwner?: boolean;
};

export function ListCard({ list, showOwner = false }: ListCardProps) {
  return (
    <Card as="article" className="h-full p-0" interactive tone="primary">
      <Link className="block h-full p-5" href={`/lists/${list.id}`}>
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-2xl">
              {list.emoji ?? "#"}
            </span>
            <VisibilityBadge isPublic={list.isPublic} />
          </div>

          <div className="mt-5 min-w-0 flex-1">
            <p className="text-secondary mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              {list.topic ?? "General"}
            </p>
            <h3 className="font-display text-xl leading-tight font-bold">
              {list.title}
            </h3>
            {list.description ? (
              <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-6">
                {list.description}
              </p>
            ) : null}
          </div>

          <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
            <div className="text-muted-foreground flex min-w-0 items-center gap-2 text-sm">
              <ListOrdered className="text-primary h-4 w-4 shrink-0" />
              <span>
                {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <ArrowUpRight className="text-primary h-4 w-4" />
          </div>

          {showOwner ? (
            <p className="text-muted-foreground mt-3 truncate text-xs">
              by {list.owner?.displayName ?? "Rankex curator"}
              {list.owner?.username ? ` @${list.owner.username}` : ""}
            </p>
          ) : null}

          {list.topItems.length > 0 ? (
            <div className="mt-4 flex -space-x-1.5">
              {list.topItems.map((item, index) => (
                <span
                  className="border-card bg-surface-elevated text-muted-foreground grid h-7 w-7 place-items-center rounded-md border-2 font-mono text-[10px] font-bold"
                  key={item.id}
                  title={item.title}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}
