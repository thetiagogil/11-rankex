"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ListSocialState } from "@/features/lists/types";
import {
  remixListAction,
  toggleListBookmarkAction,
  toggleListLikeAction,
} from "@/features/social/server/actions";

type PendingListSocialAction = "bookmark" | "like" | "remix" | null;

type UseListSocialActionsOptions = {
  listId: number;
  social: ListSocialState;
};

export const useListSocialActions = ({
  listId,
  social,
}: UseListSocialActionsOptions) => {
  const router = useRouter();
  const [liked, setLiked] = useState(social.isLikedByViewer);
  const [bookmarked, setBookmarked] = useState(social.isBookmarkedByViewer);
  const [bookmarkCount, setBookmarkCount] = useState(social.bookmarkCount);
  const [likeCount, setLikeCount] = useState(social.likeCount);
  const [pendingAction, setPendingAction] =
    useState<PendingListSocialAction>(null);
  const [isPending, startTransition] = useTransition();

  const isBusy = (action: PendingListSocialAction) =>
    isPending && pendingAction === action;

  const toggleLike = () => {
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
  };

  const toggleBookmark = () => {
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
  };

  const remixList = () => {
    setPendingAction("remix");
    startTransition(async () => {
      const result = await remixListAction(listId);
      setPendingAction(null);
      if (!result.ok) return;

      router.push(`/lists/${result.data.id}`);
      router.refresh();
    });
  };

  return {
    bookmarkCount,
    bookmarked,
    isBusy,
    isPending,
    likeCount,
    liked,
    remixList,
    toggleBookmark,
    toggleLike,
  };
};
