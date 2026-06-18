"use server";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { toActionError } from "./action-error";
import type { ActionResult } from "./action-result";
import { revalidateRankexAuthSurface } from "./revalidation";

export const signOutAction = async (): Promise<ActionResult<void>> => {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  try {
    const client = await createClient();
    const { error } = await client.auth.signOut();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateRankexAuthSurface();

    return { ok: true, data: undefined };
  } catch (error) {
    return toActionError(error, "Sign out failed.");
  }
};
