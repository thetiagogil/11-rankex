import { core, rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import type { ProfileRow } from "@/shared/types";
import type {
  RankedList,
  RankedListSummary,
} from "@/features/lists/types";
import { mapList, mapListSummary } from "@/features/lists/server/mappers";
import type {
  RankexListItemRow,
  RankexListRow,
} from "@/types/database.types";

export async function getUserListSummaries(
  client: AppSupabaseClient,
  userId: string,
): Promise<RankedListSummary[]> {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? []);
}

export async function getPublicListSummaries(
  client: AppSupabaseClient,
  limit = 30,
): Promise<RankedListSummary[]> {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? []);
}

export async function getPublicListSummariesByUser(
  client: AppSupabaseClient,
  userId: string,
): Promise<RankedListSummary[]> {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? []);
}

export async function getListById(
  client: AppSupabaseClient,
  listId: number,
): Promise<RankedList | null> {
  const { data: list, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("id", listId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!list) return null;

  const [itemsByListId, ownersById] = await Promise.all([
    getItemsByListId(client, [list.id]),
    getProfilesById(client, [list.user_id]),
  ]);

  return mapList(
    {
      list,
      items: itemsByListId.get(list.id) ?? [],
    },
    ownersById.get(list.user_id) ?? null,
  );
}

export async function assertOwnedList(
  client: AppSupabaseClient,
  listId: number,
  userId: string,
) {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("id")
    .eq("id", listId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return Boolean(data);
}

async function buildSummaries(
  client: AppSupabaseClient,
  lists: RankexListRow[],
) {
  const listIds = lists.map((list) => list.id);
  const ownerIds = Array.from(new Set(lists.map((list) => list.user_id)));
  const [itemsByListId, ownersById] = await Promise.all([
    getItemsByListId(client, listIds),
    getProfilesById(client, ownerIds),
  ]);

  return lists.map((list) =>
    mapListSummary(
      {
        list,
        items: itemsByListId.get(list.id) ?? [],
      },
      ownersById.get(list.user_id) ?? null,
    ),
  );
}

async function getItemsByListId(
  client: AppSupabaseClient,
  listIds: number[],
): Promise<Map<number, RankexListItemRow[]>> {
  const itemsByListId = new Map<number, RankexListItemRow[]>();

  if (listIds.length === 0) return itemsByListId;

  const { data, error } = await rankex(client)
    .from("list_items")
    .select("*")
    .in("list_id", listIds);

  if (error) throw new Error(error.message);

  for (const item of data ?? []) {
    const existing = itemsByListId.get(item.list_id) ?? [];
    existing.push(item);
    itemsByListId.set(item.list_id, existing);
  }

  for (const items of itemsByListId.values()) {
    items.sort((a, b) => a.position - b.position || a.id - b.id);
  }

  return itemsByListId;
}

async function getProfilesById(
  client: AppSupabaseClient,
  userIds: string[],
): Promise<Map<string, ProfileRow>> {
  const profilesById = new Map<string, ProfileRow>();

  if (userIds.length === 0) return profilesById;

  const { data, error } = await core(client)
    .from("profiles")
    .select("id, display_name, avatar_url, username, bio, created_at, updated_at")
    .in("id", userIds);

  if (error) throw new Error(error.message);

  for (const profile of data ?? []) {
    profilesById.set(profile.id, profile);
  }

  return profilesById;
}
