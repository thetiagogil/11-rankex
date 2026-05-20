import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { AppMain } from "@/shared/components/layout/app-main";
import { requireUser } from "@/shared/server/auth";

export default async function SettingsPage() {
  const currentUser = await requireUser();

  return (
    <AppMain className="pb-20">
      <section className="mt-2 max-w-3xl">
        <h1 className="font-display text-4xl leading-tight font-black sm:text-6xl">
          Settings
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Update the curator identity that appears on Rankex lists, profile
          pages, and the public Explore surface.
        </p>
      </section>

      <section className="mt-10">
        <ProfileSettingsForm currentUser={currentUser} />
      </section>
    </AppMain>
  );
}
