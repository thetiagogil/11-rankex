import { core, rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { mapProfile } from "@/shared/server/mappers";
import type { Profile, ProfileRow } from "@/shared/types";
import type {
  ListCommentRows,
  ListSocialState,
  RankedList,
  RankedListSummary,
  RemixSource,
} from "@/features/lists/types";
import { mapList, mapListSummary } from "@/features/lists/server/mappers";
import type {
  RankexListCommentRow,
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

  return buildSummaries(client, data ?? [], userId);
}

export async function getPublicListSummaries(
  client: AppSupabaseClient,
  limit = 30,
  viewerId?: string,
): Promise<RankedListSummary[]> {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? [], viewerId);
}

export async function getPublicListSummariesByUser(
  client: AppSupabaseClient,
  userId: string,
  viewerId?: string,
): Promise<RankedListSummary[]> {
  const { data, error } = await rankex(client)
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);

  return buildSummaries(client, data ?? [], viewerId);
}

export async function getListById(
  client: AppSupabaseClient,
  listId: number,
  viewerId?: string,
): Promise<RankedList | null> {
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
  viewerId?: string,
) {
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

async function getCommentsForList(
  client: AppSupabaseClient,
  listId: number,
): Promise<ListCommentRows[]> {
  const { data, error } = await rankex(client)
    .from("list_comments")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);

  const comments = data ?? [];
  const profilesById = await getProfilesById(
    client,
    Array.from(new Set(comments.map((comment) => comment.user_id))),
  );

  return comments.map((comment) => ({
    author: mapProfileRow(profilesById.get(comment.user_id) ?? null),
    comment,
  }));
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

async function getRemixSourcesById(
  client: AppSupabaseClient,
  listIds: number[],
): Promise<Map<number, RemixSource>> {
  const sourcesById = new Map<number, RemixSource>();

  if (listIds.length === 0) return sourcesById;

  const { data, error } = await rankex(client)
    .from("lists")
    .select("id, title, user_id")
    .in("id", listIds);

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const ownersById = await getProfilesById(
    client,
    Array.from(new Set(rows.map((row) => row.user_id))),
  );

  for (const source of rows) {
    sourcesById.set(source.id, {
      id: source.id,
      owner: mapProfileRow(ownersById.get(source.user_id) ?? null),
      title: source.title,
    });
  }

  return sourcesById;
}

async function getSocialByListId(
  client: AppSupabaseClient,
  listIds: number[],
  viewerId?: string,
): Promise<Map<number, ListSocialState>> {
  const socialByListId = new Map<number, ListSocialState>();

  for (const listId of listIds) {
    socialByListId.set(listId, createEmptySocialState());
  }

  if (listIds.length === 0) return socialByListId;

  const [likesResult, commentsResult, bookmarksResult] = await Promise.all([
    rankex(client)
      .from("list_likes")
      .select("list_id, user_id")
      .in("list_id", listIds),
    rankex(client).from("list_comments").select("list_id").in("list_id", listIds),
    viewerId
      ? rankex(client)
          .from("list_bookmarks")
          .select("list_id")
          .eq("user_id", viewerId)
          .in("list_id", listIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (likesResult.error) throw new Error(likesResult.error.message);
  if (commentsResult.error) throw new Error(commentsResult.error.message);
  if (bookmarksResult.error) throw new Error(bookmarksResult.error.message);

  for (const like of likesResult.data ?? []) {
    const state = socialByListId.get(like.list_id) ?? createEmptySocialState();
    state.likeCount += 1;
    state.isLikedByViewer = state.isLikedByViewer || like.user_id === viewerId;
    socialByListId.set(like.list_id, state);
  }

  for (const comment of (commentsResult.data ?? []) as Pick<
    RankexListCommentRow,
    "list_id"
  >[]) {
    const state =
      socialByListId.get(comment.list_id) ?? createEmptySocialState();
    state.commentCount += 1;
    socialByListId.set(comment.list_id, state);
  }

  for (const bookmark of bookmarksResult.data ?? []) {
    const state =
      socialByListId.get(bookmark.list_id) ?? createEmptySocialState();
    state.isBookmarkedByViewer = true;
    socialByListId.set(bookmark.list_id, state);
  }

  return socialByListId;
}

function createEmptySocialState(): ListSocialState {
  return {
    commentCount: 0,
    isBookmarkedByViewer: false,
    isLikedByViewer: false,
    likeCount: 0,
  };
}

function mapProfileRow(row: ProfileRow | null): Profile | null {
  return row ? mapProfile(row) : null;
}
