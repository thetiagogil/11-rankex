"use server";

import {
  normalizeItemInput,
  normalizeListId,
  normalizeListInput,
  normalizeTierReorderInput,
  type ItemInput,
  type ListInput,
  type TierReorderInputItem,
} from "@/features/lists/lib/validation";
import { mapItem } from "@/features/lists/server/mappers";
import {
  getOwnedListConfig,
} from "@/features/lists/server/queries";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import { toActionError } from "@/shared/server/action-error";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";
import type { RankedItem } from "@/features/lists/types";

type CreatedListResult = {
  id: number;
};

export async function createListAction(
  input: ListInput,
): Promise<ActionResult<CreatedListResult>> {
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
}

export async function updateListAction(
  listIdInput: number,
  input: ListInput,
): Promise<ActionResult<CreatedListResult>> {
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
}

export async function deleteListAction(
  listIdInput: number,
): Promise<ActionResult<void>> {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    const { error } = await rankex(client)
      .from("lists")
      .delete()
      .eq("id", listId)
      .eq("user_id", user.id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not delete list.");
  }
}

export async function createItemAction(
  listIdInput: number,
  input: ItemInput,
): Promise<ActionResult<RankedItem>> {
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
}

export async function updateItemAction(
  listIdInput: number,
  itemIdInput: number,
  input: ItemInput,
): Promise<ActionResult<RankedItem>> {
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
}

export async function deleteItemAction(
  listIdInput: number,
  itemIdInput: number,
): Promise<ActionResult<void>> {
  const listId = normalizeListId(listIdInput);
  const itemId = normalizeListId(itemIdInput);
  if (!listId || !itemId) return { ok: false, error: "Invalid item id." };

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { error } = await rankex(client)
      .from("list_items")
      .delete()
      .eq("id", itemId)
      .eq("list_id", listId);

    if (error) return { ok: false, error: error.message };

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not delete item.");
  }
}

export async function reorderItemsAction(
  listIdInput: number,
  orderedItemIds: number[],
): Promise<ActionResult<void>> {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  if (orderedItemIds.length === 0) {
    return { ok: true, data: undefined };
  }

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const listConfig = await getOwnedListConfig(client, listId, user.id);
    if (!listConfig) return { ok: false, error: "List not found." };
    if (listConfig.rankingMode !== "ranked") {
      return {
        ok: false,
        error: "Only ranked-order lists can be manually reordered.",
      };
    }

    const { data, error } = await rankex(client)
      .from("list_items")
      .select("id")
      .eq("list_id", listId);

    if (error) return { ok: false, error: error.message };

    const existingIds = new Set((data ?? []).map((item) => item.id));
    const orderedIds = new Set(orderedItemIds);
    const hasSameItems =
      existingIds.size === orderedIds.size &&
      orderedItemIds.every((itemId) => existingIds.has(itemId));

    if (!hasSameItems) {
      return {
        ok: false,
        error: "The ranking changed while you were editing. Refresh and try again.",
      };
    }

    for (const [index, itemId] of orderedItemIds.entries()) {
      const { error: updateError } = await rankex(client)
        .from("list_items")
        .update({ position: index + 1 })
        .eq("id", itemId)
        .eq("list_id", listId);

      if (updateError) {
        return { ok: false, error: updateError.message };
      }
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not reorder items.");
  }
}

export async function reorderItemsWithTiersAction(
  listIdInput: number,
  orderedItemsInput: TierReorderInputItem[],
): Promise<ActionResult<void>> {
  const listId = normalizeListId(listIdInput);
  if (!listId) return { ok: false, error: "Invalid list id." };

  const normalized = normalizeTierReorderInput(orderedItemsInput);
  if (!normalized.ok) return normalized;

  if (normalized.data.length === 0) {
    return { ok: true, data: undefined };
  }

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    const listConfig = await getOwnedListConfig(client, listId, user.id);
    if (!listConfig) return { ok: false, error: "List not found." };
    if (listConfig.rankingMode !== "tiered") {
      return {
        ok: false,
        error: "Only tiered lists can be reordered by tier.",
      };
    }
    if (normalized.data.some((item) => item.tier === null)) {
      return {
        ok: false,
        error: "Tiered lists require every item to have a tier.",
      };
    }

    const { data, error } = await rankex(client)
      .from("list_items")
      .select("id")
      .eq("list_id", listId);

    if (error) return { ok: false, error: error.message };

    const existingIds = new Set((data ?? []).map((item) => item.id));
    const orderedIds = new Set(normalized.data.map((item) => item.id));
    const hasSameItems =
      existingIds.size === orderedIds.size &&
      normalized.data.every((item) => existingIds.has(item.id));

    if (!hasSameItems) {
      return {
        ok: false,
        error: "The ranking changed while you were editing. Refresh and try again.",
      };
    }

    for (const [index, item] of normalized.data.entries()) {
      const { error: updateError } = await rankex(client)
        .from("list_items")
        .update({ position: index + 1, tier: item.tier })
        .eq("id", item.id)
        .eq("list_id", listId);

      if (updateError) {
        return { ok: false, error: updateError.message };
      }
    }

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not reorder tiers.");
  }
}

async function getNextItemPosition(
  client: Awaited<ReturnType<typeof createClient>>,
  listId: number,
) {
  const { data, error } = await rankex(client)
    .from("list_items")
    .select("position")
    .eq("list_id", listId)
    .order("position", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  return (data?.[0]?.position ?? 0) + 1;
}

async function listHasItems(
  client: Awaited<ReturnType<typeof createClient>>,
  listId: number,
) {
  const { data, error } = await rankex(client)
    .from("list_items")
    .select("id")
    .eq("list_id", listId)
    .limit(1);

  if (error) throw new Error(error.message);

  return Boolean(data?.length);
}
