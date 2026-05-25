"use server";

import { revalidatePath } from "next/cache";

import { getListById } from "@/features/lists/server/queries";
import { normalizeListId } from "@/features/lists/lib/validation";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";

type CreatedRemixResult = {
  id: number;
};

export async function toggleFollowAction(
  profileId: string,
): Promise<ActionResult<{ following: boolean }>> {
  const targetProfileId = profileId.trim();
  if (!targetProfileId) return { ok: false, error: "Invalid profile." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    if (user.id === targetProfileId) {
      return { ok: false, error: "You cannot follow yourself." };
    }

    const { data: existing, error: lookupError } = await rankex(client)
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", targetProfileId)
      .maybeSingle();

    if (lookupError) return { ok: false, error: lookupError.message };

    if (existing) {
      const { error } = await rankex(client)
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetProfileId);

      if (error) return { ok: false, error: error.message };

      revalidateSocialPaths();
      return { ok: true, data: { following: false } };
    }

    const { error } = await rankex(client).from("follows").insert({
      follower_id: user.id,
      following_id: targetProfileId,
    });

    if (error) return { ok: false, error: error.message };

    revalidateSocialPaths();
    return { ok: true, data: { following: true } };
  } catch (error) {
    return toActionError(error, "Could not update follow.");
  }
}

export async function toggleListLikeAction(
  listIdInput: number,
): Promise<ActionResult<{ liked: boolean }>> {
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

      revalidateListSocialPaths(listId);
      return { ok: true, data: { liked: false } };
    }

    const { error } = await rankex(client).from("list_likes").insert({
      list_id: listId,
      user_id: user.id,
    });

    if (error) return { ok: false, error: error.message };

    revalidateListSocialPaths(listId);
    return { ok: true, data: { liked: true } };
  } catch (error) {
    return toActionError(error, "Could not update like.");
  }
}

export async function toggleListBookmarkAction(
  listIdInput: number,
): Promise<ActionResult<{ bookmarked: boolean }>> {
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

      revalidateListSocialPaths(listId);
      return { ok: true, data: { bookmarked: false } };
    }

    const { error } = await rankex(client).from("list_bookmarks").insert({
      list_id: listId,
      user_id: user.id,
    });

    if (error) return { ok: false, error: error.message };

    revalidateListSocialPaths(listId);
    return { ok: true, data: { bookmarked: true } };
  } catch (error) {
    return toActionError(error, "Could not update bookmark.");
  }
}

export async function createListCommentAction(
  listIdInput: number,
  bodyInput: string,
): Promise<ActionResult<void>> {
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

    revalidateListSocialPaths(listId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not post comment.");
  }
}

export async function deleteListCommentAction(
  listIdInput: number,
  commentIdInput: number,
): Promise<ActionResult<void>> {
  const listId = normalizeListId(listIdInput);
  const commentId = normalizeListId(commentIdInput);
  if (!listId || !commentId) return { ok: false, error: "Invalid comment id." };

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { error } = await rankex(client)
      .from("list_comments")
      .delete()
      .eq("id", commentId)
      .eq("list_id", listId);

    if (error) return { ok: false, error: error.message };

    revalidateListSocialPaths(listId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not delete comment.");
  }
}

export async function remixListAction(
  sourceListIdInput: number,
): Promise<ActionResult<CreatedRemixResult>> {
  const sourceListId = normalizeListId(sourceListIdInput);
  if (!sourceListId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const source = await getListById(client, sourceListId, user.id);

    if (!source || !source.isPublic) {
      return { ok: false, error: "Only public lists can be remixed." };
    }

    const { data: list, error: listError } = await rankex(client)
      .from("lists")
      .insert({
        description: source.description,
        emoji: source.emoji,
        is_public: false,
        remixed_from_list_id: source.id,
        remixed_from_user_id: source.ownerId,
        title: buildRemixTitle(source.title),
        topic: source.topic,
        user_id: user.id,
      })
      .select("id")
      .single();

    if (listError || !list) {
      return {
        ok: false,
        error: listError?.message ?? "Could not remix list.",
      };
    }

    if (source.items.length > 0) {
      const { error: itemsError } = await rankex(client)
        .from("list_items")
        .insert(
          source.items.map((item, index) => ({
            list_id: list.id,
            note: item.note,
            position: index + 1,
            score: item.score,
            tier: item.tier,
            title: item.title,
          })),
        );

      if (itemsError) return { ok: false, error: itemsError.message };
    }

    revalidateListSocialPaths(source.id);
    revalidatePath("/dashboard");

    return { ok: true, data: { id: list.id } };
  } catch (error) {
    return toActionError(error, "Could not remix list.");
  }
}

function buildRemixTitle(title: string) {
  const suffix = " remix";
  const maxTitleLength = 120;
  if (title.length + suffix.length <= maxTitleLength) return `${title}${suffix}`;
  return `${title.slice(0, maxTitleLength - suffix.length).trimEnd()}${suffix}`;
}

function revalidateListSocialPaths(listId: number) {
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath(`/lists/${listId}`);
}

function revalidateSocialPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath("/profile");
}

function toActionError(error: unknown, fallback: string): ActionResult<never> {
  return {
    ok: false,
    error: error instanceof Error ? error.message : fallback,
  };
}
