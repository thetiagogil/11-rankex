import { redirect } from "next/navigation";

import { safeRedirectPath } from "@/lib/routing/redirect";

type AuthPageProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    next?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const pathname = params.mode === "signup" ? "/signup" : "/login";
  const redirectUrl = new URL(pathname, "https://rankex.local");
  const safeNext = safeRedirectPath(params.next, "/dashboard");

  if (safeNext !== "/dashboard") {
    redirectUrl.searchParams.set("next", safeNext);
  }

  if (params.error) {
    redirectUrl.searchParams.set("error", params.error);
  }

  redirect(`${redirectUrl.pathname}${redirectUrl.search}`);
}
