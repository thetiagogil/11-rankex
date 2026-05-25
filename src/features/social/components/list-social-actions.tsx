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
  canRemix?: boolean;
  className?: string;
  listId: number;
  size?: "compact" | "default";
  social: ListSocialState;
};

export function ListSocialActions({
  canRemix = false,
  className,
  listId,
  size = "default",
  social,
}: ListSocialActionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(social.isLikedByViewer);
  const [bookmarked, setBookmarked] = useState(social.isBookmarkedByViewer);
  const [likeCount, setLikeCount] = useState(social.likeCount);
  const [pendingAction, setPendingAction] = useState<
    "bookmark" | "like" | "remix" | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const countButtonSize = size === "compact" ? "sm" : "default";
  const iconButtonSize = size === "compact" ? "icon-sm" : "icon";

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
      <span
        className={cn(
          "border-border bg-background text-muted-foreground inline-flex items-center justify-center gap-1 rounded-full border font-bold shadow-none",
          size === "compact" ? "h-8 px-2.5 text-xs" : "h-10 px-2.5 text-sm",
        )}
      >
        <MessageCircle className="size-3.5" data-icon="inline-start" />
        {social.commentCount}
      </span>

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
        variant="outline"
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

      <Button
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark list"}
        disabled={isPending}
        onClick={() => {
          setPendingAction("bookmark");
          startTransition(async () => {
            const result = await toggleListBookmarkAction(listId);
            setPendingAction(null);
            if (!result.ok) return;
            setBookmarked(result.data.bookmarked);
            router.refresh();
          });
        }}
        size={iconButtonSize}
        variant="outline"
      >
        {isBusy("bookmark") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Bookmark
            className={bookmarked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
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
