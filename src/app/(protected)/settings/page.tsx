import { Settings } from "lucide-react";

import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { AppMain } from "@/shared/components/layout/app-main";
import { Card } from "@/shared/components/ui/card";
import { requireUser } from "@/shared/server/auth";

export default async function SettingsPage() {
  const currentUser = await requireUser();

  return (
    <AppMain className="pb-20">
      <section className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <Settings className="size-6 text-primary" />
          <h1 className="font-display text-3xl font-black sm:text-4xl">
            Settings
          </h1>
        </div>
        <p className="mt-3 leading-7 text-muted-foreground">
          Edit the shared profile fields Rankex uses on public lists and account
          surfaces.
        </p>

        <Card as="section" className="mt-8 bg-card p-5 sm:p-7">
          <div className="relative">
            <ProfileSettingsForm currentUser={currentUser} />
          </div>
        </Card>
      </section>
    </AppMain>
  );
}
