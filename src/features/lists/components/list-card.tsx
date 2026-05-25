import { ArrowUpRight, Heart, ListOrdered, MessageCircle } from "lucide-react";
import Link from "next/link";

import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import { getListIcon } from "@/features/lists/lib/list-icons";
import type { RankedListSummary } from "@/features/lists/types";
import { ListSocialActions } from "@/features/social/components/list-social-actions";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import { getProfileHref } from "@/shared/utils/profile";

type ListCardProps = {
  currentUserId?: string;
  list: RankedListSummary;
  showOwner?: boolean;
};

export function ListCard({
  currentUserId,
  list,
  showOwner = false,
}: ListCardProps) {
  const listIcon = getListIcon(list.emoji, list.topic);
  const Icon = listIcon.Icon;
  const accent = getListAccent(list.id);
  const tilt = getListTilt(list.id);
  const canUseSocialActions = Boolean(
    currentUserId && list.isPublic && list.ownerId !== currentUserId,
  );
  const canRemix = Boolean(
    currentUserId && list.isPublic && list.ownerId !== currentUserId,
  );

  return (
    <Card
      as="article"
      className={cn("group h-full min-w-0 justify-between p-0", tilt)}
      variant="tilt"
    >
      <Link className="block min-w-0 p-5" href={`/lists/${list.id}`}>
        <div className="relative z-10 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <span
              className="border-foreground/45 text-foreground grid size-14 shrink-0 place-items-center rounded-2xl border shadow-[1px_1px_0_0_var(--shadow-ink)]"
              style={{ background: accent }}
            >
              <Icon aria-hidden="true" className="size-7" strokeWidth={2.4} />
            </span>
            <VisibilityBadge isPublic={list.isPublic} />
          </div>

          <div className="mt-5 min-w-0 flex-1">
            <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
              {list.topic ?? "General"}
            </p>
            <h3 className="font-display group-hover:text-primary text-2xl leading-none font-bold transition-colors">
              {list.title}
            </h3>
            {list.description ? (
              <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-6">
                {list.description}
              </p>
            ) : null}
          </div>

          <div className="border-border mt-5 flex min-w-0 items-center justify-between gap-3 border-t border-dashed pt-4">
            <div className="text-muted-foreground flex min-w-0 items-center gap-2 text-sm">
              <ListOrdered className="text-primary size-4 shrink-0" />
              <span>
                {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <ArrowUpRight className="text-primary size-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </div>

          {list.topItems.length > 0 ? (
            <div className="mt-4 flex">
              {list.topItems.map((item, index) => (
                <span
                  className={
                    index === 0
                      ? "border-card bg-gradient-gold text-primary-foreground grid size-7 place-items-center rounded-md border font-mono text-[10px] font-bold"
                      : "border-card bg-secondary text-muted-foreground -ml-1.5 grid size-7 place-items-center rounded-md border font-mono text-[10px] font-bold"
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

      <div className="border-border relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-dashed px-5 py-4">
        {showOwner && list.owner ? (
          <Link
            className="text-muted-foreground hover:text-primary min-w-0 truncate text-xs font-bold transition"
            href={getProfileHref(list.owner)}
          >
            @{list.owner.username ?? list.owner.displayName}
          </Link>
        ) : (
          <div className="text-muted-foreground flex items-center gap-3 text-xs font-bold">
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5" />
              {list.social.likeCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {list.social.commentCount}
            </span>
          </div>
        )}

        {canUseSocialActions ? (
          <ListSocialActions
            canRemix={canRemix}
            listId={list.id}
            size="compact"
            social={list.social}
          />
        ) : null}
      </div>
    </Card>
  );
}

const listAccents = [
  "oklch(0.78 0.1 50)",
  "oklch(0.68 0.09 245)",
  "oklch(0.78 0.06 320)",
  "oklch(0.78 0.07 150)",
  "oklch(0.86 0.05 95)",
] as const;

const listTilts = ["", "", "tilt-r", "", "", "tilt-l"] as const;

function getListAccent(id: number) {
  return listAccents[id % listAccents.length];
}

function getListTilt(id: number) {
  return listTilts[id % listTilts.length];
}
