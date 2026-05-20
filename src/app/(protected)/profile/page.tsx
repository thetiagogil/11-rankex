import { ProfilePageView } from "@/features/profile/components/profile-page-view";
import { buildProfileOverview } from "@/features/profile/server/queries";
import { getUserListSummaries } from "@/features/lists/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";

export default async function ProfilePage() {
  const currentUser = await requireUser();
  const client = await createClient();
  const lists = await getUserListSummaries(client, currentUser.id);
  const overview = buildProfileOverview(currentUser.profile, lists);

  return (
    <AppMain className="pb-20">
      <ProfilePageView isCurrentUser overview={overview} />
    </AppMain>
  );
}
