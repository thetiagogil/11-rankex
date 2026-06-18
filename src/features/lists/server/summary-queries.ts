import { rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import type { RankedListSummary, RankexListRow } from "@/features/lists/types";
import { mapListSummary } from "@/features/lists/server/mappers";
import {
  getItemsByListId,
  getProfilesById,
  getRemixSourcesById,
  getSocialByListId,
} from "@/features/lists/server/query-loaders";

export const getUserListSummaries = async (
  client: AppSupabaseClient,
  userId: string,
): Promise<RankedListSummary[]> => {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? [], userId);
};

export const getPublicListSummaries = async (
  client: AppSupabaseClient,
  limit = 30,
  viewerId?: string,
): Promise<RankedListSummary[]> => {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? [], viewerId);
};

export const getPublicListSummariesByUser = async (
  client: AppSupabaseClient,
  userId: string,
  viewerId?: string,
): Promise<RankedListSummary[]> => {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? [], viewerId);
};

const buildSummaries = async (
  client: AppSupabaseClient,
  lists: RankexListRow[],
  viewerId?: string,
) => {
  const listIds = lists.map((list) => list.id);
  const ownerIds = Array.from(new Set(lists.map((list) => list.user_id)));
  const remixListIds = Array.from(
    new Set(
      lists
        .map((list) => list.remixed_from_list_id)
        .filter((id): id is number => id !== null),
    ),
  );
  const [itemsByListId, ownersById, socialByListId, remixSourcesById] =
    await Promise.all([
      getItemsByListId(client, listIds),
      getProfilesById(client, ownerIds),
      getSocialByListId(client, listIds, viewerId),
      getRemixSourcesById(client, remixListIds),
    ]);

  return lists.map((list) =>
    mapListSummary(
      {
        list,
        items: itemsByListId.get(list.id) ?? [],
      },
      ownersById.get(list.user_id) ?? null,
      {
        remixSource:
          list.remixed_from_list_id === null
            ? null
            : (remixSourcesById.get(list.remixed_from_list_id) ?? null),
        social: socialByListId.get(list.id),
      },
    ),
  );
};
