import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/components/auth-form";
import { isSupabaseConfigured } from "@/lib/env";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { SetupMissing } from "@/shared/components/setup-missing";
import { getCurrentUser } from "@/shared/server/auth";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  const params = await searchParams;
  const safeNext = safeRedirectPath(params.next, "/dashboard");
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect(safeNext);
  }

  return (
    <AuthForm
      initialError={params.error ?? null}
      mode="signup"
      next={safeNext}
    />
  );
}
