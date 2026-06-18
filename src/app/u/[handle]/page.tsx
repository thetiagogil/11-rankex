import { notFound, redirect } from "next/navigation";

import { PublicProfilePageView } from "@/app/u/[handle]/_components/public-profile-page-view";
import { getPublicProfileOverview } from "@/features/profile/server/queries";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/shared/server/auth";
import { getProfileHandle } from "@/shared/utils/profile";

type PublicProfilePageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const [{ handle }, currentUser] = await Promise.all([
    params,
    getCurrentUser(),
  ]);
  const currentHandle = currentUser
    ? getProfileHandle(currentUser.profile)
    : null;

  if (currentHandle && decodeURIComponent(handle) === currentHandle) {
    redirect("/profile");
  }

  const client = await createClient();
  const overview = await getPublicProfileOverview(
    client,
    handle,
    currentUser?.id,
  );

  if (!overview) {
    notFound();
  }

  return (
    <PublicProfilePageView
      currentUserId={currentUser?.id}
      overview={overview}
    />
  );
}
