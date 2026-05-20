import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

export type AppSupabaseClient = SupabaseClient<Database>;

export function core(client: AppSupabaseClient) {
  return client.schema("core");
}

export function rankex(client: AppSupabaseClient) {
  return client.schema("rankex");
}
