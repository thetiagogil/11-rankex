import type { AuthMode } from "@/features/auth/types";

export const getAuthModeHref = (mode: AuthMode, next: string) => {
  const pathname = mode === "login" ? "/login" : "/signup";

  if (next === "/dashboard") {
    return pathname;
  }

  return `${pathname}?next=${encodeURIComponent(next)}`;
};
