import { ProfilePageView } from "@/features/profile/components/profile-page-view";
import type { ProfileOverview } from "@/features/profile/types";
import { AppMain } from "@/shared/components/layout/app-main";

type ProfilePageShellProps = {
  currentUserId?: string;
  isCurrentUser?: boolean;
  overview: ProfileOverview;
};

export function ProfilePageShell({
  currentUserId,
  isCurrentUser = false,
  overview,
}: ProfilePageShellProps) {
  return (
    <AppMain className="pb-20">
      <ProfilePageView
        currentUserId={currentUserId}
        isCurrentUser={isCurrentUser}
        overview={overview}
      />
    </AppMain>
  );
}
