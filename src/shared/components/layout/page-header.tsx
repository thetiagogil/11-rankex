import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type PageHeaderProps = {
  actions?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: string;
  icon?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
};

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  icon,
  meta,
  title,
}: PageHeaderProps) {
  return (
    <section className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 gap-4">
          {icon ? (
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/35 bg-primary/10 text-primary shadow-glow">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-mono text-xs tracking-widest text-primary uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-1 font-display text-4xl leading-tight font-black text-balance sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
    </section>
  );
}
