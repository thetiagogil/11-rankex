import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppMainProps = ComponentPropsWithoutRef<"main"> & {
  constrained?: boolean;
};

export function AppMain({
  children,
  className,
  constrained = true,
  ...props
}: AppMainProps) {
  return (
    <main
      className={cn(
        "w-full pt-8 sm:pt-10",
        constrained && "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
