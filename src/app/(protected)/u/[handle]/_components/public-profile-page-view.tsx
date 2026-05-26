import { ProfilePageShell } from "@/features/profile/components/profile-page-shell";
import type { ProfileOverview } from "@/features/profile/types";

type PublicProfilePageViewProps = {
  currentUserId: string;
  overview: ProfileOverview;
};

export function PublicProfilePageView({
  currentUserId,
  overview,
}: PublicProfilePageViewProps) {
  return <ProfilePageShell currentUserId={currentUserId} overview={overview} />;
}
