import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import { getPublicListSummaries } from "@/features/lists/server/queries";
import { getDiscoverableProfiles } from "@/features/profile/server/queries";
import { getFollowingIds } from "@/features/social/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
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
    <AppMain className="pb-20">
      <section className="mt-2 max-w-3xl">
        <h1 className="font-display text-4xl leading-tight font-black sm:text-6xl">
          Explore
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Browse public rankings, discover curators, and follow the topics that
          keep showing up in the community canon.
        </p>
      </section>

      <ExploreView
        currentUserId={currentUser.id}
        followingIds={followingIds}
        lists={lists}
        profiles={profiles}
      />
    </AppMain>
  );
}
