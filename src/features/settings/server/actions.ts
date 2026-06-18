"use server";

import {
  normalizeProfileSettingsInput,
  type ProfileSettingsInput,
} from "@/features/settings/lib/profile-validation";
import { core } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import { toActionError } from "@/shared/server/action-error";
import { requireAuthUser } from "@/shared/server/auth";
import { mapProfile } from "@/shared/server/mappers";
import { revalidateRankexProfileSurface } from "@/shared/server/revalidation";
import type { Profile } from "@/shared/types";

export const updateProfileSettingsAction = async (
  input: ProfileSettingsInput,
): Promise<ActionResult<Profile>> => {
  const normalized = normalizeProfileSettingsInput(input);

  if (!normalized.ok) {
    return normalized;
  }

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    const { data, error } = await core(client)
      .from("profiles")
      .update({
        bio: normalized.data.bio,
        display_name: normalized.data.displayName,
        username: normalized.data.username,
      })
      .eq("id", user.id)
      .select(
        "id, display_name, avatar_url, username, bio, created_at, updated_at",
      )
      .single();

    if (error || !data) {
      return {
        ok: false,
        error:
          error?.code === "23505"
            ? "That username is already taken."
            : (error?.message ?? "Could not update profile settings."),
      };
    }

    revalidateRankexProfileSurface();

    return { ok: true, data: mapProfile(data) };
  } catch (error) {
    return toActionError(error, "Could not update profile settings.");
  }
};
