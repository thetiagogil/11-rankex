import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppShellProps = ComponentPropsWithoutRef<"div">;

export const AppShell = ({ className, ...props }: AppShellProps) => {
  return (
    <div className="confetti-bg relative min-h-screen overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0" />
      <div
        className={cn("relative flex min-h-screen flex-col", className)}
        {...props}
      />
    </div>
  );
};
