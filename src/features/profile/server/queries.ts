import { getPublicListSummariesByUser } from "@/features/lists/server/queries";
import type { RankedListSummary } from "@/features/lists/types";
import type { ProfileOverview, ProfileListStats } from "@/features/profile/types";
import { core, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { mapProfile } from "@/shared/server/mappers";
import type { Profile, ProfileRow } from "@/shared/types";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function buildProfileOverview(
  profile: Profile,
  lists: RankedListSummary[],
): ProfileOverview {
  return {
    lists,
    profile,
    stats: buildProfileStats(lists),
  };
}

export async function getPublicProfileOverview(
  client: AppSupabaseClient,
  handle: string,
): Promise<ProfileOverview | null> {
  const profileRow = await getProfileByHandle(client, handle);

  if (!profileRow) return null;

  const profile = mapProfile(profileRow);
  const lists = await getPublicListSummariesByUser(client, profile.id);

  return buildProfileOverview(profile, lists);
}

async function getProfileByHandle(
  client: AppSupabaseClient,
  handle: string,
): Promise<ProfileRow | null> {
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
}

async function getProfileByColumn(
  client: AppSupabaseClient,
  column: "id" | "username",
  value: string,
) {
  const { data, error } = await core(client)
    .from("profiles")
    .select("id, display_name, avatar_url, username, bio, created_at, updated_at")
    .eq(column, value)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}

function buildProfileStats(lists: RankedListSummary[]): ProfileListStats {
  return {
    itemCount: lists.reduce((sum, list) => sum + list.itemCount, 0),
    listCount: lists.length,
    publicListCount: lists.filter((list) => list.isPublic).length,
    topics: Array.from(
      new Set(lists.map((list) => list.topic).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b)),
  };
}
