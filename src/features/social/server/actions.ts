"use server";

import {
  createListCommentAction as createListCommentActionImpl,
  deleteListCommentAction as deleteListCommentActionImpl,
} from "@/features/social/server/comment-actions";
import { toggleFollowAction as toggleFollowActionImpl } from "@/features/social/server/follow-actions";
import {
  toggleListBookmarkAction as toggleListBookmarkActionImpl,
  toggleListLikeAction as toggleListLikeActionImpl,
} from "@/features/social/server/list-reaction-actions";
import { remixListAction as remixListActionImpl } from "@/features/social/server/remix-actions";

export const createListCommentAction = async (
  ...args: Parameters<typeof createListCommentActionImpl>
) => createListCommentActionImpl(...args);

export const deleteListCommentAction = async (
  ...args: Parameters<typeof deleteListCommentActionImpl>
) => deleteListCommentActionImpl(...args);

export const toggleFollowAction = async (
  ...args: Parameters<typeof toggleFollowActionImpl>
) => toggleFollowActionImpl(...args);

export const toggleListBookmarkAction = async (
  ...args: Parameters<typeof toggleListBookmarkActionImpl>
) => toggleListBookmarkActionImpl(...args);

export const toggleListLikeAction = async (
  ...args: Parameters<typeof toggleListLikeActionImpl>
) => toggleListLikeActionImpl(...args);

export const remixListAction = async (
  ...args: Parameters<typeof remixListActionImpl>
) => remixListActionImpl(...args);
