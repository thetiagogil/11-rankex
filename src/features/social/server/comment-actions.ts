"use server";

import { normalizeListId } from "@/features/lists/lib/validation";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";

export const createListCommentAction = async (
  listIdInput: number,
  bodyInput: string,
): Promise<ActionResult<void>> => {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  const body = bodyInput.trim();
  if (!body) return { ok: false, error: "Comment cannot be empty." };
  if (body.length > 500) {
    return { ok: false, error: "Comment must be 500 characters or less." };
  }

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const { data: list, error: listError } = await rankex(client)
      .from("lists")
      .select("id, is_public, user_id")
      .eq("id", listId)
      .maybeSingle();

    if (listError) return { ok: false, error: listError.message };
    if (!list || !list.is_public) {
      return {
        ok: false,
        error: "Only public lists can receive comments.",
      };
    }
    if (list.user_id === user.id) {
      return {
        ok: false,
        error: "You cannot comment on your own list.",
      };
    }

    const { error } = await rankex(client).from("list_comments").insert({
      body,
      list_id: listId,
      user_id: user.id,
    });

    if (error) return { ok: false, error: error.message };

    revalidateRankexListSurface(listId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not post comment.");
  }
};

export const deleteListCommentAction = async (
  listIdInput: number,
  commentIdInput: number,
): Promise<ActionResult<void>> => {
  const listId = normalizeListId(listIdInput);
  const commentId = normalizeListId(commentIdInput);
  if (!listId || !commentId) return { ok: false, error: "Invalid comment id." };

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { data, error } = await rankex(client)
      .from("list_comments")
      .delete()
      .eq("id", commentId)
      .eq("list_id", listId)
      .select("id")
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    if (!data) {
      return {
        ok: false,
        error: "Comment not found or you do not have permission to delete it.",
      };
    }

    revalidateRankexListSurface(listId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not delete comment.");
  }
};
