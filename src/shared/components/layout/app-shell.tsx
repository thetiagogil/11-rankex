import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppShellProps = ComponentPropsWithoutRef<"div">;

export function AppShell({ className, ...props }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <div className="grain pointer-events-none absolute inset-0" />
      <div
        className={cn("relative flex min-h-screen flex-col", className)}
        {...props}
      />
    </div>
  );
}
