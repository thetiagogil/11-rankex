"use server";

import {
  normalizeItemInput,
  normalizeListId,
  type ItemInput,
} from "@/features/lists/lib/validation";
import { mapItem } from "@/features/lists/server/mappers";
import { getOwnedListConfig } from "@/features/lists/server/queries";
import type { RankedItem } from "@/features/lists/types";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";

export const createItemAction = async (
  listIdInput: number,
  input: ItemInput,
): Promise<ActionResult<RankedItem>> => {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const listConfig = await getOwnedListConfig(client, listId, user.id);
    if (!listConfig) return { ok: false, error: "List not found." };

    const normalized = normalizeItemInput(input, listConfig.rankingMode);
    if (!normalized.ok) return normalized;

    const position = await getNextItemPosition(client, listId);
    const { data, error } = await rankex(client)
      .from("list_items")
      .insert({
        list_id: listId,
        note: normalized.data.note,
        position,
        score: normalized.data.score,
        tier: normalized.data.tier,
        title: normalized.data.title,
      })
      .select("*")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Could not add item." };
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: mapItem(data) };
  } catch (error) {
    return toActionError(error, "Could not add item.");
  }
};

export const updateItemAction = async (
  listIdInput: number,
  itemIdInput: number,
  input: ItemInput,
): Promise<ActionResult<RankedItem>> => {
  const listId = normalizeListId(listIdInput);
  const itemId = normalizeListId(itemIdInput);
  if (!listId || !itemId) return { ok: false, error: "Invalid item id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const listConfig = await getOwnedListConfig(client, listId, user.id);
    if (!listConfig) return { ok: false, error: "List not found." };

    const normalized = normalizeItemInput(input, listConfig.rankingMode);
    if (!normalized.ok) return normalized;

    const { data, error } = await rankex(client)
      .from("list_items")
      .update({
        note: normalized.data.note,
        score: normalized.data.score,
        tier: normalized.data.tier,
        title: normalized.data.title,
      })
      .eq("id", itemId)
      .eq("list_id", listId)
      .select("*")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Could not update item." };
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: mapItem(data) };
  } catch (error) {
    return toActionError(error, "Could not update item.");
  }
};

export const deleteItemAction = async (
  listIdInput: number,
  itemIdInput: number,
): Promise<ActionResult<void>> => {
  const listId = normalizeListId(listIdInput);
  const itemId = normalizeListId(itemIdInput);
  if (!listId || !itemId) return { ok: false, error: "Invalid item id." };

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { data, error } = await rankex(client)
      .from("list_items")
      .delete()
      .eq("id", itemId)
      .eq("list_id", listId)
      .select("id")
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    if (!data) {
      return {
        ok: false,
        error: "Item not found or you do not have permission to delete it.",
      };
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not delete item.");
  }
};

const getNextItemPosition = async (
  client: Awaited<ReturnType<typeof createClient>>,
  listId: number,
) => {
  const { data, error } = await rankex(client)
    .from("list_items")
    .select("position")
    .eq("list_id", listId)
    .order("position", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  return (data?.[0]?.position ?? 0) + 1;
};
