import type { ReactNode } from "react";

import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";
import { requireUser } from "@/shared/server/auth";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const currentUser = await requireUser();

  return (
    <ProtectedAppShell currentUser={currentUser}>{children}</ProtectedAppShell>
  );
}
