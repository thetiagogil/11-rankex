import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

export type AppSupabaseClient = SupabaseClient<Database>;

export const core = (client: AppSupabaseClient) => {
  return client.schema("core");
};

export const rankex = (client: AppSupabaseClient) => {
  return client.schema("rankex");
};
