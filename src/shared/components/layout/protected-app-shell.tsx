"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ReactNode } from "react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ProfileMenu } from "@/shared/components/layout/profile-menu";
import { ProtectedNavLinks } from "@/shared/components/layout/protected-nav-links";
import { signOutAction } from "@/shared/server/auth-actions";
import type { CurrentUser } from "@/shared/types";

type ProtectedAppShellProps = {
  children: ReactNode;
  currentUser: CurrentUser;
};

export function ProtectedAppShell({ children }: ProtectedAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const signOut = () => {
    setFeedback(null);

    startTransition(async () => {
      const result = await signOutAction();

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      router.replace("/");
      router.refresh();
    });
  };

  return (
    <AppShell>
      <AppHeader
        center={<ProtectedNavLinks pathname={pathname} />}
        actions={
          <ProfileMenu
            isPending={isPending}
            onSignOut={signOut}
            pathname={pathname}
          />
        }
        leading={<AppLogo href="/" />}
      />

      {feedback ? (
        <div className="fixed inset-x-0 top-20 z-50 mx-auto max-w-6xl px-4 sm:px-6">
          <p className="border-destructive/40 bg-destructive/10 text-destructive-foreground rounded-md border px-4 py-3 text-sm">
            {feedback}
          </p>
        </div>
      ) : null}

      {children}
    </AppShell>
  );
}
