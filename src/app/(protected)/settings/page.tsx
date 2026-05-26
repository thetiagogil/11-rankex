import { SettingsPageView } from "@/app/(protected)/settings/_components/settings-page-view";
import { requireUser } from "@/shared/server/auth";

export default async function SettingsPage() {
  const currentUser = await requireUser();

  return <SettingsPageView currentUser={currentUser} />;
}
