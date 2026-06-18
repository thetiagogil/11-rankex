import { LandingContent } from "@/app/_components/landing-content";
import { ButtonLink } from "@/shared/components/button-link";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";

type LandingPageViewProps = {
  isAuthenticated: boolean;
};

export const LandingPageView = ({ isAuthenticated }: LandingPageViewProps) => {
  if (isAuthenticated) {
    return (
      <ProtectedAppShell>
        <LandingContent isAuthenticated />
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

      <LandingContent isAuthenticated={false} />
    </AppShell>
  );
};
