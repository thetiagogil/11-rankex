import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/components/auth-form";
import { SetupMissing } from "@/shared/components/setup-missing";
import { isSupabaseConfigured } from "@/lib/env";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { getCurrentUser } from "@/shared/server/auth";

type AuthPageProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    next?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
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
      initialMode={params.mode === "signup" ? "signup" : "signin"}
      next={safeNext}
    />
  );
}
