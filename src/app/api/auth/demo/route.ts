import { NextResponse, type NextRequest } from "next/server";

import { getDemoUserEnv } from "@/lib/env";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const next = safeRedirectPath(formData.get("next")?.toString(), "/dashboard");
  const failureUrl = new URL("/auth", requestUrl.origin);
  failureUrl.searchParams.set("next", next);

  try {
    const { email, password } = getDemoUserEnv();
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      failureUrl.searchParams.set("error", "Demo account is unavailable.");
      return NextResponse.redirect(failureUrl, { status: 303 });
    }

    const continueUrl = new URL("/auth/continue", requestUrl.origin);
    continueUrl.searchParams.set("next", next);

    return NextResponse.redirect(continueUrl, { status: 303 });
  } catch {
    failureUrl.searchParams.set("error", "Demo account is not configured.");
    return NextResponse.redirect(failureUrl, { status: 303 });
  }
}
