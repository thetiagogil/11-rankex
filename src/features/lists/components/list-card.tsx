import { ArrowUpRight, ListOrdered } from "lucide-react";
import Link from "next/link";

import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import { getListEmoji } from "@/features/lists/lib/list-emoji";
import type { RankedListSummary } from "@/features/lists/types";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type ListCardProps = {
  list: RankedListSummary;
  showOwner?: boolean;
};

export function ListCard({ list, showOwner = false }: ListCardProps) {
  const emoji = getListEmoji(list.emoji, list.topic);
  const accent = getListAccent(list.id);
  const tilt = getListTilt(list.id);

  return (
    <Card
      as="article"
      className={cn("group h-full p-0", tilt)}
      interactive
    >
      <Link className="block h-full p-5" href={`/lists/${list.id}`}>
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <span
              className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-foreground text-3xl leading-none shadow-[3px_3px_0_0_var(--shadow-ink)]"
              style={{ background: accent }}
            >
              {emoji}
            </span>
            <VisibilityBadge isPublic={list.isPublic} />
          </div>

          <div className="mt-5 min-w-0 flex-1">
            <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {list.topic ?? "General"}
            </p>
            <h3 className="font-display text-2xl leading-none font-bold transition-colors group-hover:text-primary">
              {list.title}
            </h3>
            {list.description ? (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {list.description}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-border pt-4">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <ListOrdered className="size-4 shrink-0 text-primary" />
              <span>
                {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <ArrowUpRight className="size-4 text-primary opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </div>

          {showOwner ? (
            <p className="mt-3 truncate text-xs text-muted-foreground">
              by {list.owner?.displayName ?? "Rankex curator"}
              {list.owner?.username ? ` @${list.owner.username}` : ""}
            </p>
          ) : null}

          {list.topItems.length > 0 ? (
            <div className="mt-4 flex">
              {list.topItems.map((item, index) => (
                <span
                  className={
                    index === 0
                      ? "grid size-7 place-items-center rounded-md border-2 border-card bg-gradient-gold font-mono text-[10px] font-bold text-primary-foreground"
                      : "-ml-1.5 grid size-7 place-items-center rounded-md border-2 border-card bg-secondary font-mono text-[10px] font-bold text-muted-foreground"
                  }
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

const listAccents = [
  "oklch(0.7 0.21 35)",
  "oklch(0.66 0.24 0)",
  "oklch(0.58 0.2 290)",
  "oklch(0.78 0.17 55)",
  "oklch(0.75 0.18 145)",
] as const;

const listTilts = ["tilt-l", "tilt-r", "", "tilt-r", "tilt-l", ""] as const;

function getListAccent(id: number) {
  return listAccents[id % listAccents.length];
}

function getListTilt(id: number) {
  return listTilts[id % listTilts.length];
}
