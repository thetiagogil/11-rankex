import { CurrentProfilePageView } from "@/app/(protected)/profile/_components/current-profile-page-view";
import { buildProfileOverview } from "@/features/profile/server/queries";
import { getUserListSummaries } from "@/features/lists/server/queries";
import { getProfileSocialStats } from "@/features/social/server/queries";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";

export default async function ProfilePage() {
  const currentUser = await requireUser();
  const client = await createClient();
  const [lists, social] = await Promise.all([
    getUserListSummaries(client, currentUser.id),
    getProfileSocialStats(client, currentUser.id, currentUser.id),
  ]);
  const overview = buildProfileOverview(currentUser.profile, lists, social);

  return (
    <CurrentProfilePageView
      currentUserId={currentUser.id}
      overview={overview}
    />
  );
}
