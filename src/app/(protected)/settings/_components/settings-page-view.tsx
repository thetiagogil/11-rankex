import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { AppMain } from "@/shared/components/layout/app-main";
import { PageHeader } from "@/shared/components/page-header";
import type { CurrentUser } from "@/shared/types";

type SettingsPageViewProps = {
  currentUser: CurrentUser;
};

export const SettingsPageView = ({ currentUser }: SettingsPageViewProps) => {
  return (
    <AppMain className="pb-20">
      <div className="mx-auto w-full max-w-3xl">
        <PageHeader
          description="Manage how your profile appears across Rankex."
          title="Settings"
        />

        <section className="mt-10">
          <ProfileSettingsForm currentUser={currentUser} />
        </section>
      </div>
    </AppMain>
  );
};
