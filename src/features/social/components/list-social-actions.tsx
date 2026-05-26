"use client";

import { Bookmark, Copy, Heart, Loader2, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  remixListAction,
  toggleListBookmarkAction,
  toggleListLikeAction,
} from "@/features/social/server/actions";
import type { ListSocialState } from "@/features/lists/types";
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
  const router = useRouter();
  const [liked, setLiked] = useState(social.isLikedByViewer);
  const [bookmarked, setBookmarked] = useState(social.isBookmarkedByViewer);
  const [bookmarkCount, setBookmarkCount] = useState(social.bookmarkCount);
  const [likeCount, setLikeCount] = useState(social.likeCount);
  const [pendingAction, setPendingAction] = useState<
    "bookmark" | "like" | "remix" | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const isPillAppearance = appearance === "pills";
  const countButtonSize = isPillAppearance
    ? "xs"
    : size === "compact"
      ? "sm"
      : "default";
  const iconButtonSize = size === "compact" ? "icon-sm" : "icon";
  const bookmarkButtonSize = showBookmarkCount ? countButtonSize : iconButtonSize;
  const actionVariant = isPillAppearance ? "pill" : "outline";
  const passivePillClass = cn(
    "border-border bg-background text-muted-foreground inline-flex items-center justify-center gap-1 rounded-full border font-bold shadow-none",
    isPillAppearance
      ? "h-7 px-2 text-xs"
      : size === "compact"
        ? "h-8 px-2.5 text-xs"
        : "h-10 px-2.5 text-sm",
  );

  const isBusy = (action: typeof pendingAction) =>
    isPending && pendingAction === action;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        size === "compact" ? "gap-1.5" : "gap-3",
        className,
      )}
    >
      {!isPillAppearance ? (
        <span className={passivePillClass}>
          <MessageCircle className="size-3.5" data-icon="inline-start" />
          {social.commentCount}
        </span>
      ) : null}

      <Button
        aria-label={liked ? "Unlike list" : "Like list"}
        disabled={isPending}
        onClick={() => {
          setPendingAction("like");
          startTransition(async () => {
            const previous = liked;
            const result = await toggleListLikeAction(listId);
            setPendingAction(null);
            if (!result.ok) return;
            setLiked(result.data.liked);
            setLikeCount((count) =>
              result.data.liked === previous
                ? count
                : count + (result.data.liked ? 1 : -1),
            );
            router.refresh();
          });
        }}
        size={countButtonSize}
        variant={actionVariant}
      >
        {isBusy("like") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Heart
            className={liked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
        <span>{likeCount}</span>
      </Button>

      {isPillAppearance ? (
        <span className={passivePillClass}>
          <MessageCircle className="size-3.5" data-icon="inline-start" />
          {social.commentCount}
        </span>
      ) : null}

      <Button
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark list"}
        disabled={isPending}
        onClick={() => {
          setPendingAction("bookmark");
          startTransition(async () => {
            const previous = bookmarked;
            const result = await toggleListBookmarkAction(listId);
            setPendingAction(null);
            if (!result.ok) return;
            setBookmarked(result.data.bookmarked);
            setBookmarkCount((count) =>
              result.data.bookmarked === previous
                ? count
                : Math.max(0, count + (result.data.bookmarked ? 1 : -1)),
            );
            router.refresh();
          });
        }}
        size={bookmarkButtonSize}
        variant={actionVariant}
      >
        {isBusy("bookmark") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Bookmark
            className={bookmarked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
        {showBookmarkCount ? <span>{bookmarkCount}</span> : null}
      </Button>

      {canRemix ? (
        <Button
          disabled={isPending}
          onClick={() => {
            setPendingAction("remix");
            startTransition(async () => {
              const result = await remixListAction(listId);
              setPendingAction(null);
              if (!result.ok) return;
              router.push(`/lists/${result.data.id}`);
              router.refresh();
            });
          }}
          aria-label="Remix list"
          size={iconButtonSize}
          variant="outline"
        >
          {isBusy("remix") ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
        </Button>
      ) : null}
    </div>
  );
}
