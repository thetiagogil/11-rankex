"use server";

import { normalizeListId } from "@/features/lists/lib/validation";
import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexListSurface } from "@/shared/server/revalidation";

type CreatedRemixResult = {
  id: number;
};

export const remixListAction = async (
  sourceListIdInput: number,
): Promise<ActionResult<CreatedRemixResult>> => {
  const sourceListId = normalizeListId(sourceListIdInput);
  if (!sourceListId) return { ok: false, error: "Invalid list id." };

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { data, error } = await rankex(client).rpc("remix_list", {
      p_source_list_id: sourceListId,
    });

    if (error || !data) {
      return {
        ok: false,
        error: error?.message ?? "Could not remix list.",
      };
    }

    revalidateRankexListSurface(sourceListId);

    return { ok: true, data: { id: data } };
  } catch (error) {
    return toActionError(error, "Could not remix list.");
  }
};
