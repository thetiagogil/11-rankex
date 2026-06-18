import { rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { normalizeRankingMode } from "@/features/lists/lib/ranking-mode";
import type { RankingMode } from "@/features/lists/types";

export const assertOwnedList = async (
  client: AppSupabaseClient,
  listId: number,
  userId: string,
) => {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("id")
    .eq("id", listId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return Boolean(data);
};

export const getOwnedListConfig = async (
  client: AppSupabaseClient,
  listId: number,
  userId: string,
): Promise<{ id: number; rankingMode: RankingMode } | null> => {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("id, ranking_mode")
    .eq("id", listId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id,
    rankingMode: normalizeRankingMode(data.ranking_mode),
  };
};
