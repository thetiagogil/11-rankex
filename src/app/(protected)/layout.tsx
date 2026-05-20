import type { ReactNode } from "react";

import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";
import { requireUser } from "@/shared/server/auth";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  await requireUser();

  return <ProtectedAppShell>{children}</ProtectedAppShell>;
}
