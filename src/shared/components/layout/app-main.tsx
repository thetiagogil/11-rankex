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
        "w-full px-4 pt-12 sm:px-6",
        constrained && "mx-auto max-w-6xl",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
