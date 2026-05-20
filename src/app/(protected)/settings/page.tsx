import { Settings, UserRound } from "lucide-react";

import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { AppMain } from "@/shared/components/layout/app-main";
import { PageHeader } from "@/shared/components/layout/page-header";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { requireUser } from "@/shared/server/auth";

export default async function SettingsPage() {
  const currentUser = await requireUser();

  return (
    <AppMain className="pb-20">
      <PageHeader
        actions={
          <ButtonLink href="/profile" variant="outline">
            <UserRound data-icon="inline-start" />
            View profile
          </ButtonLink>
        }
        description="Tune the curator identity that appears on Rankex lists, profile pages, and the public Explore surface."
        eyebrow="Curator controls"
        icon={<Settings className="size-6" />}
        title="Settings"
      />

      <section className="mt-10">
        <ProfileSettingsForm currentUser={currentUser} />
      </section>
    </AppMain>
  );
}
