import { rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import type { RankedList } from "@/features/lists/types";
import { mapList } from "@/features/lists/server/mappers";
import {
  getCommentsForList,
  getItemsByListId,
  getProfilesById,
  getRemixSourcesById,
  getSocialByListId,
} from "@/features/lists/server/query-loaders";

export const getListById = async (
  client: AppSupabaseClient,
  listId: number,
  viewerId?: string,
): Promise<RankedList | null> => {
  const { data: list, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("id", listId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!list) return null;

  const remixListIds =
    list.remixed_from_list_id === null ? [] : [list.remixed_from_list_id];

  const [
    itemsByListId,
    ownersById,
    socialByListId,
    comments,
    remixSourcesById,
  ] = await Promise.all([
    getItemsByListId(client, [list.id]),
    getProfilesById(client, [list.user_id]),
    getSocialByListId(client, [list.id], viewerId),
    getCommentsForList(client, list.id),
    getRemixSourcesById(client, remixListIds),
  ]);

  return mapList(
    {
      list,
      items: itemsByListId.get(list.id) ?? [],
    },
    ownersById.get(list.user_id) ?? null,
    {
      comments,
      remixSource:
        list.remixed_from_list_id === null
          ? null
          : (remixSourcesById.get(list.remixed_from_list_id) ?? null),
      social: socialByListId.get(list.id),
    },
  );
};
