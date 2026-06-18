import { ProfilePageShell } from "@/features/profile/components/profile-page-shell";
import type { ProfileOverview } from "@/features/profile/types";

type CurrentProfilePageViewProps = {
  currentUserId: string;
  overview: ProfileOverview;
};

export const CurrentProfilePageView = ({
  currentUserId,
  overview,
}: CurrentProfilePageViewProps) => {
  return (
    <ProfilePageShell
      currentUserId={currentUserId}
      isCurrentUser
      overview={overview}
    />
  );
};
