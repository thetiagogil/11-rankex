import { ArrowRight, Bookmark, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import { getListIcon } from "@/features/lists/lib/list-icons";
import type { RankedListSummary } from "@/features/lists/types";
import { ListSocialActions } from "@/features/social/components/list-social-actions";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import { getProfileHref } from "@/shared/utils/profile";

type ListCardProps = {
  currentUserId?: string;
  footerMode?: "default" | "explore";
  isTilted?: boolean;
  list: RankedListSummary;
  showOwner?: boolean;
};

export function ListCard({
  currentUserId,
  footerMode = "default",
  isTilted = true,
  list,
  showOwner = false,
}: ListCardProps) {
  const listIcon = getListIcon(list.emoji, list.topic);
  const Icon = listIcon.Icon;
  const accent = getListAccent(list.id);
  const tilt = isTilted ? getListTilt(list.id) : "";
  const canUseSocialActions = Boolean(
    currentUserId && list.isPublic && list.ownerId !== currentUserId,
  );
  const canRemix = Boolean(
    currentUserId && list.isPublic && list.ownerId !== currentUserId,
  );
  const useExploreFooter = footerMode === "explore";

  return (
    <Card
      as="article"
      className={cn("group min-w-0 gap-0 p-0", tilt)}
      variant={isTilted ? "tilt" : "shadow"}
    >
      <Link
        aria-label={`Open ${list.title}`}
        className="focus-visible:ring-ring absolute inset-0 z-20 rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={`/lists/${list.id}`}
      />

      <div className="relative z-10 min-w-0 p-4 pb-3">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="border-foreground/35 text-foreground grid size-11 shrink-0 place-items-center rounded-xl border"
                style={{ background: accent }}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={2.4} />
              </span>
              <p className="text-muted-foreground truncate font-mono text-[10px] tracking-widest uppercase">
                {list.topic ?? "General"}
              </p>
            </div>
            <VisibilityBadge isPublic={list.isPublic} />
          </div>

          <div className="mt-4 min-w-0">
            <h3 className="font-display group-hover:text-primary text-xl leading-tight font-bold transition-colors">
              {list.title}
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-2 min-h-12 text-sm leading-6">
              {list.description ?? ""}
            </p>
          </div>
        </div>
      </div>

      <div className="border-border relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-dashed px-4 py-3">
        {useExploreFooter ? (
          <ExploreCardFooter
            canUseSocialActions={canUseSocialActions}
            list={list}
            showOwner={showOwner}
          />
        ) : (
          <>
            {showOwner && list.owner ? (
              <Link
                className="text-muted-foreground hover:text-primary relative z-30 min-w-0 truncate text-xs font-bold transition"
                href={getProfileHref(list.owner)}
              >
                @{list.owner.username ?? list.owner.displayName}
              </Link>
            ) : (
              <ListCardSocialPills social={list.social} />
            )}

            <div className="flex items-center gap-2">
              {canUseSocialActions ? (
                <ListSocialActions
                  canRemix={canRemix}
                  className="relative z-30"
                  listId={list.id}
                  size="compact"
                  social={list.social}
                />
              ) : null}
              <span className="text-primary group-hover:bg-primary/10 group-hover:text-accent pointer-events-none grid size-7 place-items-center rounded-full transition group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function ExploreCardFooter({
  canUseSocialActions,
  list,
  showOwner,
}: {
  canUseSocialActions: boolean;
  list: RankedListSummary;
  showOwner: boolean;
}) {
  const ownerHandle =
    showOwner && list.owner
      ? `@${list.owner.username ?? list.owner.displayName}`
      : null;

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {canUseSocialActions ? (
        <ListSocialActions
          appearance="pills"
          canRemix={false}
          className="relative z-30 shrink-0"
          listId={list.id}
          showBookmarkCount
          size="compact"
          social={list.social}
        />
      ) : (
        <ListCardSocialPills includeBookmarks social={list.social} />
      )}

      <div className="pointer-events-none relative z-30 ml-auto flex min-w-0 items-center gap-1">
        {ownerHandle && list.owner ? (
          <Link
            className="text-muted-foreground hover:text-primary pointer-events-auto min-w-0 truncate text-xs font-bold transition"
            href={getProfileHref(list.owner)}
          >
            {ownerHandle}
          </Link>
        ) : null}
        <span className="text-primary group-hover:bg-primary/10 group-hover:text-accent grid size-7 place-items-center rounded-full transition group-hover:translate-x-0.5">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </div>
  );
}

function ListCardSocialPills({
  includeBookmarks = false,
  social,
}: {
  includeBookmarks?: boolean;
  social: RankedListSummary["social"];
}) {
  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold">
      <ListCardSocialPill
        icon={<Heart className="size-3.5" />}
        label={pluralize(social.likeCount, "like")}
        value={social.likeCount}
      />
      <ListCardSocialPill
        icon={<MessageCircle className="size-3.5" />}
        label={pluralize(social.commentCount, "comment")}
        value={social.commentCount}
      />
      {includeBookmarks ? (
        <ListCardSocialPill
          icon={<Bookmark className="size-3.5" />}
          label={pluralize(social.bookmarkCount, "bookmark")}
          value={social.bookmarkCount}
        />
      ) : null}
    </div>
  );
}

function ListCardSocialPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <span
      aria-label={`${value} ${label}`}
      className="border-border bg-background inline-flex h-7 items-center gap-1 rounded-full border px-2"
      title={`${value} ${label}`}
    >
      {icon}
      {value}
    </span>
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

function pluralize(value: number, singular: string) {
  return value === 1 ? singular : `${singular}s`;
}
