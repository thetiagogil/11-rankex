import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type PageHeaderProps = {
  align?: "center" | "start";
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  title: ReactNode;
};

export function PageHeader({
  align = "start",
  children,
  className,
  description,
  title,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "mt-2 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h1 className="font-display text-4xl leading-tight font-black sm:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="text-muted-foreground mt-4 text-lg leading-8">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
