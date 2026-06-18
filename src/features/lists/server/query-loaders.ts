import { core, rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { mapProfile } from "@/shared/server/mappers";
import type { Profile, ProfileRow } from "@/shared/types";
import type {
  ListCommentRows,
  ListSocialState,
  RankexListCommentRow,
  RankexListItemRow,
  RemixSource,
} from "@/features/lists/types";

export const getItemsByListId = async (
  client: AppSupabaseClient,
  listIds: number[],
): Promise<Map<number, RankexListItemRow[]>> => {
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
};

export const getCommentsForList = async (
  client: AppSupabaseClient,
  listId: number,
): Promise<ListCommentRows[]> => {
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
};

export const getProfilesById = async (
  client: AppSupabaseClient,
  userIds: string[],
): Promise<Map<string, ProfileRow>> => {
  const profilesById = new Map<string, ProfileRow>();

  if (userIds.length === 0) return profilesById;

  const { data, error } = await core(client)
    .from("profiles")
    .select(
      "id, display_name, avatar_url, username, bio, created_at, updated_at",
    )
    .in("id", userIds);

  if (error) throw new Error(error.message);

  for (const profile of data ?? []) {
    profilesById.set(profile.id, profile);
  }

  return profilesById;
};

export const getRemixSourcesById = async (
  client: AppSupabaseClient,
  listIds: number[],
): Promise<Map<number, RemixSource>> => {
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
};

export const getSocialByListId = async (
  client: AppSupabaseClient,
  listIds: number[],
  viewerId?: string,
): Promise<Map<number, ListSocialState>> => {
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
    rankex(client)
      .from("list_comments")
      .select("list_id")
      .in("list_id", listIds),
    rankex(client)
      .from("list_bookmarks")
      .select("list_id, user_id")
      .in("list_id", listIds),
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
    state.bookmarkCount += 1;
    state.isBookmarkedByViewer =
      state.isBookmarkedByViewer || bookmark.user_id === viewerId;
    socialByListId.set(bookmark.list_id, state);
  }

  return socialByListId;
};

const createEmptySocialState = (): ListSocialState => ({
  bookmarkCount: 0,
  commentCount: 0,
  isBookmarkedByViewer: false,
  isLikedByViewer: false,
  likeCount: 0,
});

const mapProfileRow = (row: ProfileRow | null): Profile | null =>
  row ? mapProfile(row) : null;
