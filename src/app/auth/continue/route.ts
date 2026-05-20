import { NextResponse, type NextRequest } from "next/server";

import { safeRedirectPath } from "@/lib/routing/redirect";
import { getCurrentUser } from "@/shared/server/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = safeRedirectPath(
    requestUrl.searchParams.get("next"),
    "/dashboard",
  );
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    const authUrl = new URL("/auth", requestUrl.origin);
    authUrl.searchParams.set("next", next);

    return NextResponse.redirect(authUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
