"use server";

import {
  normalizeListId,
  normalizeListInput,
  type ListInput,
} from "@/features/lists/lib/validation";
import { getOwnedListConfig } from "@/features/lists/server/queries";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";

type CreatedListResult = {
  id: number;
};

export const createListAction = async (
  input: ListInput,
): Promise<ActionResult<CreatedListResult>> => {
  const normalized = normalizeListInput(input);
  if (!normalized.ok) return normalized;

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const { data, error } = await rankex(client)
      .from("lists")
      .insert({
        description: normalized.data.description,
        emoji: normalized.data.emoji,
        is_public: normalized.data.isPublic,
        ranking_mode: normalized.data.rankingMode,
        title: normalized.data.title,
        topic: normalized.data.topic,
        user_id: user.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Could not create list." };
    }

    revalidateRankexListSurface();

    return { ok: true, data: { id: data.id } };
  } catch (error) {
    return toActionError(error, "Could not create list.");
  }
};

export const updateListAction = async (
  listIdInput: number,
  input: ListInput,
): Promise<ActionResult<CreatedListResult>> => {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  const normalized = normalizeListInput(input);
  if (!normalized.ok) return normalized;

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const currentList = await getOwnedListConfig(client, listId, user.id);

    if (!currentList) {
      return { ok: false, error: "List not found." };
    }

    if (currentList.rankingMode !== normalized.data.rankingMode) {
      const hasItems = await listHasItems(client, listId);
      if (hasItems) {
        return {
          ok: false,
          error: "Ranking style can only be changed before items are added.",
        };
      }
    }

    const { data, error } = await rankex(client)
      .from("lists")
      .update({
        description: normalized.data.description,
        emoji: normalized.data.emoji,
        is_public: normalized.data.isPublic,
        ranking_mode: normalized.data.rankingMode,
        title: normalized.data.title,
        topic: normalized.data.topic,
      })
      .eq("id", listId)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Could not update list." };
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: { id: data.id } };
  } catch (error) {
    return toActionError(error, "Could not update list.");
  }
};

export const deleteListAction = async (
  listIdInput: number,
): Promise<ActionResult<void>> => {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    const { data, error } = await rankex(client)
      .from("lists")
      .delete()
      .eq("id", listId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }
    if (!data) {
      return { ok: false, error: "List not found." };
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not delete list.");
  }
};

const listHasItems = async (
  client: Awaited<ReturnType<typeof createClient>>,
  listId: number,
) => {
  const { data, error } = await rankex(client)
    .from("list_items")
    .select("id")
    .eq("list_id", listId)
    .limit(1);

  if (error) throw new Error(error.message);

  return Boolean(data?.length);
};
