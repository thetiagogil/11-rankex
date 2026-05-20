import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { AppMain } from "@/shared/components/layout/app-main";
import { Card } from "@/shared/components/ui/card";
import { requireUser } from "@/shared/server/auth";

export default async function SettingsPage() {
  const currentUser = await requireUser();

  return (
    <AppMain className="pb-16">
      <section className="mx-auto max-w-3xl">
        <p className="text-secondary font-mono text-[10px] tracking-[0.25em] uppercase">
          settings
        </p>
        <h1 className="font-display mt-2 text-4xl font-black sm:text-5xl">
          Profile settings
        </h1>
        <p className="text-muted-foreground mt-3 leading-7">
          Edit the shared profile fields Rankex uses on public lists and account
          surfaces.
        </p>

        <Card as="section" className="mt-8 p-5 sm:p-7" gradient tone="primary">
          <div className="relative">
            <ProfileSettingsForm currentUser={currentUser} />
          </div>
        </Card>
      </section>
    </AppMain>
  );
}
