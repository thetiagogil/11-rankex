import { LandingPageView } from "@/app/_components/landing-page-view";
import { getCurrentUser } from "@/shared/server/auth";

export default async function LandingPage() {
  const currentUser = await getCurrentUser();

  return <LandingPageView isAuthenticated={Boolean(currentUser)} />;
}
