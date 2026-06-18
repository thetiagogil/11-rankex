import { ProfilePageShell } from "@/features/profile/components/profile-page-shell";
import type { ProfileOverview } from "@/features/profile/types";
import { ButtonLink } from "@/shared/components/button-link";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";

type PublicProfilePageViewProps = {
  currentUserId?: string;
  overview: ProfileOverview;
};

export const PublicProfilePageView = ({
  currentUserId,
  overview,
}: PublicProfilePageViewProps) => {
  if (currentUserId) {
    return (
      <ProtectedAppShell>
        <ProfilePageShell currentUserId={currentUserId} overview={overview} />
      </ProtectedAppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader
        actions={
          <ButtonLink className="[box-shadow:none]" href="/login" size="lg">
            Log in
          </ButtonLink>
        }
      />

      <ProfilePageShell overview={overview} />
    </AppShell>
  );
};
