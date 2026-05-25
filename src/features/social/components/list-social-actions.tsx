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
  showLabels?: boolean;
  size?: "compact" | "default";
  social: ListSocialState;
};

export function ListSocialActions({
  canRemix = false,
  className,
  listId,
  showLabels = false,
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
  const buttonSize = size === "compact" ? "sm" : "default";

  const isBusy = (action: typeof pendingAction) =>
    isPending && pendingAction === action;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
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
        size={buttonSize}
        variant={liked ? "default" : "outline"}
      >
        {isBusy("like") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Heart
            className={liked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
        {showLabels ? "Like" : null}
        {likeCount}
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
        size={buttonSize}
        variant={bookmarked ? "default" : "outline"}
      >
        {isBusy("bookmark") ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <Bookmark
            className={bookmarked ? "fill-current" : undefined}
            data-icon="inline-start"
          />
        )}
        {showLabels ? (bookmarked ? "Saved" : "Save") : null}
      </Button>

      <span className="border-border bg-secondary text-muted-foreground inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-bold">
        <MessageCircle className="size-3.5" data-icon="inline-start" />
        {social.commentCount}
      </span>

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
          size={buttonSize}
          variant="outline"
        >
          {isBusy("remix") ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
          Remix
        </Button>
      ) : null}
    </div>
  );
}
