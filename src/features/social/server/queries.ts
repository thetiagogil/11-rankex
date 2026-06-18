import { rankex, type AppSupabaseClient } from "@/lib/supabase/schemas";
import type { ProfileSocialStats } from "@/features/social/types";

export const getFollowingIds = async (
  client: AppSupabaseClient,
  userId: string,
): Promise<string[]> => {
  const { data, error } = await rankex(client)
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (error) throw new Error(error.message);

  return (data ?? []).map((follow) => follow.following_id);
};

export const getProfileSocialStats = async (
  client: AppSupabaseClient,
  profileId: string,
  viewerId?: string,
): Promise<ProfileSocialStats> => {
  const [followersResult, followingResult, publicListsResult, savedResult] =
    await Promise.all([
      rankex(client)
        .from("follows")
        .select("follower_id")
        .eq("following_id", profileId),
      rankex(client)
        .from("follows")
        .select("following_id")
        .eq("follower_id", profileId),
      rankex(client)
        .from("lists")
        .select("id")
        .eq("user_id", profileId)
        .eq("is_public", true),
      viewerId === profileId
        ? rankex(client)
            .from("list_bookmarks")
            .select("list_id")
            .eq("user_id", profileId)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (followersResult.error) throw new Error(followersResult.error.message);
  if (followingResult.error) throw new Error(followingResult.error.message);
  if (publicListsResult.error) throw new Error(publicListsResult.error.message);
  if (savedResult.error) throw new Error(savedResult.error.message);

  const publicListIds = (publicListsResult.data ?? []).map((list) => list.id);
  const likesReceivedCount = await getLikesReceivedCount(client, publicListIds);

  return {
    followerCount: followersResult.data?.length ?? 0,
    followingCount: followingResult.data?.length ?? 0,
    isFollowedByViewer:
      Boolean(viewerId) &&
      viewerId !== profileId &&
      (followersResult.data ?? []).some(
        (follow) => follow.follower_id === viewerId,
      ),
    likesReceivedCount,
    savedListCount: savedResult.data?.length ?? 0,
  };
};

const getLikesReceivedCount = async (
  client: AppSupabaseClient,
  publicListIds: number[],
) => {
  if (publicListIds.length === 0) return 0;

  const { data, error } = await rankex(client)
    .from("list_likes")
    .select("list_id")
    .in("list_id", publicListIds);

  if (error) throw new Error(error.message);

  return data?.length ?? 0;
};
