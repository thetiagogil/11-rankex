"use server";

import {
  normalizeListId,
  normalizeTierReorderInput,
  type TierReorderInputItem,
} from "@/features/lists/lib/validation";
import { getOwnedListConfig } from "@/features/lists/server/queries";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";

export const reorderItemsAction = async (
  listIdInput: number,
  orderedItemIds: number[],
): Promise<ActionResult<void>> => {
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

    const { error } = await rankex(client).rpc("reorder_ranked_items", {
      p_list_id: listId,
      p_ordered_item_ids: orderedItemIds,
    });

    if (error) return { ok: false, error: error.message };

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not reorder items.");
  }
};

export const reorderItemsWithTiersAction = async (
  listIdInput: number,
  orderedItemsInput: TierReorderInputItem[],
): Promise<ActionResult<void>> => {
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

    const { error } = await rankex(client).rpc("reorder_tiered_items", {
      p_list_id: listId,
      p_ordered_items: normalized.data,
    });

    if (error) return { ok: false, error: error.message };

    revalidateRankexListSurface(listId);

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Could not reorder tiers.");
  }
};
