"use client";

import { Bookmark, Copy, Heart, Loader2, MessageCircle } from "lucide-react";

import type { ListSocialState } from "@/features/lists/types";
import { useListSocialActions } from "@/features/social/hooks/use-list-social-actions";
import { CountPill } from "@/shared/components/count-pill";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

type ListSocialActionsProps = {
  appearance?: "buttons" | "pills";
  canRemix?: boolean;
  className?: string;
  listId: number;
  size?: "compact" | "default";
  showBookmarkCount?: boolean;
  social: ListSocialState;
};

export function ListSocialActions({
  appearance = "buttons",
  canRemix = false,
  className,
  listId,
  showBookmarkCount = false,
  size = "default",
  social,
}: ListSocialActionsProps) {
  const actions = useListSocialActions({ listId, social });
  const isPillAppearance = appearance === "pills";
  const countButtonSize = isPillAppearance
    ? "xs"
    : size === "compact"
      ? "sm"
      : "default";
  const iconButtonSize = size === "compact" ? "icon-sm" : "icon";
  const bookmarkButtonSize = showBookmarkCount ? countButtonSize : iconButtonSize;
  const actionVariant = isPillAppearance ? "pill" : "outline";
  const passivePillSize = isPillAppearance
    ? "sm"
    : size === "compact"
      ? "default"
      : "lg";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        size === "compact" ? "gap-1.5" : "gap-3",
        className,
      )}
    >
      {!isPillAppearance ? (
        <CountPill
          icon={<MessageCircle data-icon="inline-start" />}
          singularLabel="comment"
          size={passivePillSize}
          value={social.commentCount}
        />
      ) : null}

      <Button
        aria-label={actions.liked ? "Unlike list" : "Like list"}
        disabled={actions.isPending}
        onClick={actions.toggleLike}
        size={countButtonSize}
        variant={actionVariant}
      >
        {actions.isBusy("like") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Heart
            className={actions.liked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
        <span>{actions.likeCount}</span>
      </Button>

      {isPillAppearance ? (
        <CountPill
          icon={<MessageCircle data-icon="inline-start" />}
          singularLabel="comment"
          size={passivePillSize}
          value={social.commentCount}
        />
      ) : null}

      <Button
        aria-label={
          actions.bookmarked ? "Remove bookmark" : "Bookmark list"
        }
        disabled={actions.isPending}
        onClick={actions.toggleBookmark}
        size={bookmarkButtonSize}
        variant={actionVariant}
      >
        {actions.isBusy("bookmark") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Bookmark
            className={actions.bookmarked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
        {showBookmarkCount ? <span>{actions.bookmarkCount}</span> : null}
      </Button>

      {canRemix ? (
        <Button
          aria-label="Remix list"
          disabled={actions.isPending}
          onClick={actions.remixList}
          size={iconButtonSize}
          variant="outline"
        >
          {actions.isBusy("remix") ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
        </Button>
      ) : null}
    </div>
  );
}
