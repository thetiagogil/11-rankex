import { getPublicListSummariesByUser } from "@/features/lists/server/queries";
import type { RankedListSummary } from "@/features/lists/types";
import type {
  ProfileOverview,
  ProfileListStats,
} from "@/features/profile/types";
import { getProfileSocialStats } from "@/features/social/server/queries";
import type { ProfileSocialStats } from "@/features/social/types";
import { core, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { mapProfile } from "@/shared/server/mappers";
import type { Profile, ProfileRow } from "@/shared/types";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const buildProfileOverview = (
  profile: Profile,
  lists: RankedListSummary[],
  social: ProfileSocialStats,
): ProfileOverview => {
  return {
    lists,
    profile,
    social,
    stats: buildProfileStats(lists),
  };
};

export const getPublicProfileOverview = async (
  client: AppSupabaseClient,
  handle: string,
  viewerId?: string,
): Promise<ProfileOverview | null> => {
  const profileRow = await getProfileByHandle(client, handle);

  if (!profileRow) return null;

  const profile = mapProfile(profileRow);
  const [lists, social] = await Promise.all([
    getPublicListSummariesByUser(client, profile.id, viewerId),
    getProfileSocialStats(client, profile.id, viewerId),
  ]);

  return buildProfileOverview(profile, lists, social);
};

export const getDiscoverableProfiles = async (
  client: AppSupabaseClient,
  options: {
    excludeUserId?: string;
    followingIds?: string[];
    limit?: number;
  } = {},
): Promise<Profile[]> => {
  const { excludeUserId, followingIds = [], limit } = options;
  let query = core(client)
    .from("profiles")
    .select(
      "id, display_name, avatar_url, username, bio, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const followingSet = new Set(followingIds);
  const profiles = (data ?? []).map(mapProfile);
  const nonFollowingProfiles = shuffleProfiles(
    profiles.filter((profile) => !followingSet.has(profile.id)),
  );
  const followingProfiles = shuffleProfiles(
    profiles.filter((profile) => followingSet.has(profile.id)),
  );
  const prioritizedProfiles = [...nonFollowingProfiles, ...followingProfiles];

  return typeof limit === "number"
    ? prioritizedProfiles.slice(0, limit)
    : prioritizedProfiles;
};

const getProfileByHandle = async (
  client: AppSupabaseClient,
  handle: string,
): Promise<ProfileRow | null> => {
  const normalizedHandle = decodeURIComponent(handle).trim();
  if (!normalizedHandle) return null;

  const usernameProfile = await getProfileByColumn(
    client,
    "username",
    normalizedHandle,
  );
  if (usernameProfile) return usernameProfile;

  if (!uuidPattern.test(normalizedHandle)) {
    return null;
  }

  return getProfileByColumn(client, "id", normalizedHandle);
};

const getProfileByColumn = async (
  client: AppSupabaseClient,
  column: "id" | "username",
  value: string,
) => {
  const { data, error } = await core(client)
    .from("profiles")
    .select(
      "id, display_name, avatar_url, username, bio, created_at, updated_at",
    )
    .eq(column, value)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const buildProfileStats = (lists: RankedListSummary[]): ProfileListStats => {
  return {
    listCount: lists.length,
  };
};

const shuffleProfiles = (profiles: Profile[]) => {
  const shuffled = [...profiles];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};
