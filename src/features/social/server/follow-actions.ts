"use server";

import { rankex } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "@/shared/server/action-error";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";
import { revalidateRankexProfileSurface } from "@/shared/server/revalidation";

export const toggleFollowAction = async (
  profileId: string,
): Promise<ActionResult<{ following: boolean }>> => {
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

      revalidateRankexProfileSurface();
      return { ok: true, data: { following: false } };
    }

    const { error } = await rankex(client).from("follows").insert({
      follower_id: user.id,
      following_id: targetProfileId,
    });

    if (error) return { ok: false, error: error.message };

    revalidateRankexProfileSurface();
    return { ok: true, data: { following: true } };
  } catch (error) {
    return toActionError(error, "Could not update follow.");
  }
};
