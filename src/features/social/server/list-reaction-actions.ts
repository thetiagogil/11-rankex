"use server";

import { normalizeListId } from "@/features/lists/lib/validation";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";

export const toggleListLikeAction = async (
  listIdInput: number,
): Promise<ActionResult<{ liked: boolean }>> => {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    const { data: existing, error: lookupError } = await rankex(client)
      .from("list_likes")
      .select("list_id")
      .eq("list_id", listId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) return { ok: false, error: lookupError.message };

    if (existing) {
      const { error } = await rankex(client)
        .from("list_likes")
        .delete()
        .eq("list_id", listId)
        .eq("user_id", user.id);

      if (error) return { ok: false, error: error.message };

      revalidateRankexListSurface(listId);
      return { ok: true, data: { liked: false } };
    }

    const { error } = await rankex(client).from("list_likes").insert({
      list_id: listId,
      user_id: user.id,
    });

    if (error) return { ok: false, error: error.message };

    revalidateRankexListSurface(listId);
    return { ok: true, data: { liked: true } };
  } catch (error) {
    return toActionError(error, "Could not update like.");
  }
};

export const toggleListBookmarkAction = async (
  listIdInput: number,
): Promise<ActionResult<{ bookmarked: boolean }>> => {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    const { data: existing, error: lookupError } = await rankex(client)
      .from("list_bookmarks")
      .select("list_id")
      .eq("list_id", listId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) return { ok: false, error: lookupError.message };

    if (existing) {
      const { error } = await rankex(client)
        .from("list_bookmarks")
        .delete()
        .eq("list_id", listId)
        .eq("user_id", user.id);

      if (error) return { ok: false, error: error.message };

      revalidateRankexListSurface(listId);
      return { ok: true, data: { bookmarked: false } };
    }

    const { error } = await rankex(client).from("list_bookmarks").insert({
      list_id: listId,
      user_id: user.id,
    });

    if (error) return { ok: false, error: error.message };

    revalidateRankexListSurface(listId);
    return { ok: true, data: { bookmarked: true } };
  } catch (error) {
    return toActionError(error, "Could not update bookmark.");
  }
};
