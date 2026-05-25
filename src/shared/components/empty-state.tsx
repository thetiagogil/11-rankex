import type { ReactNode } from "react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { cn } from "@/shared/utils/cn";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  title: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <Empty
      className={cn(
        "border-foreground/20 bg-background/25 min-h-64 rounded-[1.75rem] border px-6 py-16",
        className,
      )}
    >
      <EmptyHeader className="max-w-md">
        <EmptyTitle className="text-foreground font-sans text-xl leading-tight font-semibold">
          {title}
        </EmptyTitle>
        <EmptyDescription className="max-w-md text-sm leading-6">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {action ? <EmptyContent className="mt-2">{action}</EmptyContent> : null}
    </Empty>
  );
}
