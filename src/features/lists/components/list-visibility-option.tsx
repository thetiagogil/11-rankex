import type { ReactNode } from "react";

import { ToggleGroupItem } from "@/shared/components/ui/toggle-group";

type ListVisibilityOptionProps = {
  description: string;
  icon: ReactNode;
  label: string;
  value: string;
};

export const ListVisibilityOption = ({
  description,
  icon,
  label,
  value,
}: ListVisibilityOptionProps) => {
  return (
    <ToggleGroupItem
      className="border-border bg-secondary/45 hover:bg-secondary data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary h-auto min-h-20 w-full min-w-0 shrink flex-col items-start justify-start rounded-xl border p-3 text-left whitespace-normal [&_svg]:size-4"
      value={value}
    >
      <span className="flex w-full min-w-0 items-center gap-2 text-sm font-semibold">
        {icon}
        {label}
      </span>
      <span className="text-muted-foreground mt-1 block w-full min-w-0 text-xs leading-snug text-wrap break-words">
        {description}
      </span>
    </ToggleGroupItem>
  );
};
