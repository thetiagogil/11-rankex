import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database.types";

const SUPABASE_AUTH_COOKIE_PREFIX = "sb-";

const isSupabaseAuthCookie = (name: string) => {
  return (
    name.startsWith(SUPABASE_AUTH_COOKIE_PREFIX) &&
    (name.includes("auth-token") || name.includes("code-verifier"))
  );
};

const isInvalidRefreshTokenError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const maybeAuthError = error as Error & { code?: string };

  return (
    maybeAuthError.code === "refresh_token_not_found" ||
    error.message.includes("Invalid Refresh Token") ||
    error.message.includes("Refresh Token Not Found")
  );
};

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    await supabase.auth.getClaims();
  } catch (error) {
    if (!isInvalidRefreshTokenError(error)) {
      throw error;
    }

    const authCookieNames = request.cookies
      .getAll()
      .map(({ name }) => name)
      .filter(isSupabaseAuthCookie);

    authCookieNames.forEach((name) => {
      request.cookies.delete(name);
    });

    response = NextResponse.next({ request });

    authCookieNames.forEach((name) => {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    });
  }

  return response;
};
