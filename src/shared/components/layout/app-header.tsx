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

export const AppHeader = ({
  actions,
  center,
  className,
  innerClassName,
  leading,
  ...props
}: AppHeaderProps) => {
  return (
    <header
      className={cn(
        "relative z-40 mb-2 w-full pt-5 sm:mb-4 sm:pt-7",
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
          <nav className="hidden items-center justify-center gap-6 md:flex">
            {center}
          </nav>
        ) : (
          <span className="hidden md:block" />
        )}
        {actions ? (
          <nav className="flex items-center justify-end gap-2 justify-self-end [&_a]:shadow-none [&_button]:shadow-none">
            {actions}
          </nav>
        ) : null}
      </AppContainer>
    </header>
  );
};
