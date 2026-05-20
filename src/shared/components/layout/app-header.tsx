import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { AppContainer } from "@/shared/components/layout/app-container";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { cn } from "@/shared/utils/cn";

type AppHeaderProps = ComponentPropsWithoutRef<"header"> & {
  actions?: ReactNode;
  center?: ReactNode;
  innerClassName?: string;
  leading?: ReactNode;
};

export function AppHeader({
  actions,
  center,
  className,
  innerClassName,
  leading,
  ...props
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-40 w-full pt-5 sm:pt-6",
        className,
      )}
      {...props}
    >
      <AppContainer
        className={cn(
          "grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]",
          innerClassName,
        )}
      >
        <div className="min-w-0 justify-self-start">
          {leading ?? <AppLogo href="/" />}
        </div>
        {center ? (
          <nav className="hidden items-center justify-center gap-1 rounded-2xl border border-border bg-card/70 p-1 shadow-elevated md:flex">
            {center}
          </nav>
        ) : (
          <span className="hidden md:block" />
        )}
        {actions ? (
          <nav className="flex items-center justify-end gap-2 justify-self-end">
            {actions}
          </nav>
        ) : null}
      </AppContainer>
    </header>
  );
}
