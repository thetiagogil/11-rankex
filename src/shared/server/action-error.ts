import type { ActionResult } from "@/shared/server/action-result";

export const toActionError = (
  error: unknown,
  fallback: string,
): ActionResult<never> => {
  return {
    ok: false,
    error: error instanceof Error ? error.message : fallback,
  };
};
