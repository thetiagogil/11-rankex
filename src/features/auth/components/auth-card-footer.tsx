import Link from "next/link";

import { DividerLabel } from "@/shared/components/divider-label";
import { Button } from "@/shared/components/ui/button";

type AuthCardFooterProps = {
  alternateHref: string;
  isSignup: boolean;
  next: string;
  pending: boolean;
};

export function AuthCardFooter({
  alternateHref,
  isSignup,
  next,
  pending,
}: AuthCardFooterProps) {
  return (
    <>
      <DividerLabel>or</DividerLabel>
      <form action="/api/auth/demo" className="w-full" method="post">
        <input name="next" type="hidden" value={next} />
        <Button
          className="w-full"
          disabled={pending}
          type="submit"
          variant="outline"
        >
          Use demo account
        </Button>
      </form>

      <p className="text-muted-foreground w-full text-center text-sm">
        {isSignup ? "Already have an account?" : "No account yet?"}{" "}
        <Link
          className="text-foreground font-bold underline-offset-4 hover:underline"
          href={alternateHref}
        >
          {isSignup ? "Log in" : "Create account"}
        </Link>
      </p>
    </>
  );
}
