import { DashboardPageView } from "@/app/(protected)/dashboard/_components/dashboard-page-view";
import { getUserListSummaries } from "@/features/lists/server/queries";
import { getProfileSocialStats } from "@/features/social/server/queries";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const client = await createClient();
  const [lists, social] = await Promise.all([
    getUserListSummaries(client, currentUser.id),
    getProfileSocialStats(client, currentUser.id, currentUser.id),
  ]);

  return (
    <DashboardPageView
      currentUserId={currentUser.id}
      displayName={currentUser.profile.displayName}
      lists={lists}
      social={social}
    />
  );
}
