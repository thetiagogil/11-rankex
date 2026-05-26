import { ExplorePageView } from "@/app/(protected)/explore/_components/explore-page-view";
import { getPublicListSummaries } from "@/features/lists/server/queries";
import { getDiscoverableProfiles } from "@/features/profile/server/queries";
import { getFollowingIds } from "@/features/social/server/queries";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";

export default async function ExplorePage() {
  const currentUser = await requireUser();
  const client = await createClient();
  const [lists, followingIds] = await Promise.all([
    getPublicListSummaries(client, 30, currentUser.id),
    getFollowingIds(client, currentUser.id),
  ]);
  const profiles = await getDiscoverableProfiles(client, {
    excludeUserId: currentUser.id,
    followingIds,
  });

  return (
    <ExplorePageView
      currentUserId={currentUser.id}
      followingIds={followingIds}
      lists={lists}
      profiles={profiles}
    />
  );
}
