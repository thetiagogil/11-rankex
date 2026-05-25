import { notFound, redirect } from "next/navigation";

import { ProfilePageView } from "@/features/profile/components/profile-page-view";
import { getPublicProfileOverview } from "@/features/profile/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";
import { getProfileHandle } from "@/shared/utils/profile";

type PublicProfilePageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const [{ handle }, currentUser] = await Promise.all([params, requireUser()]);
  const currentHandle = getProfileHandle(currentUser.profile);

  if (decodeURIComponent(handle) === currentHandle) {
    redirect("/profile");
  }

  const client = await createClient();
  const overview = await getPublicProfileOverview(client, handle, currentUser.id);

  if (!overview) {
    notFound();
  }

  return (
    <AppMain className="pb-20">
      <ProfilePageView currentUserId={currentUser.id} overview={overview} />
    </AppMain>
  );
}
