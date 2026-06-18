import { Globe, LockKeyhole } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";

type VisibilityBadgeProps = {
  iconOnly?: boolean;
  isPublic: boolean;
};

export const VisibilityBadge = ({
  iconOnly = false,
  isPublic,
}: VisibilityBadgeProps) => {
  const Icon = isPublic ? Globe : LockKeyhole;
  const label = isPublic ? "Public" : "Private";

  return (
    <Badge
      aria-label={iconOnly ? label : undefined}
      className={iconOnly ? "w-6 px-0" : undefined}
      title={iconOnly ? label : undefined}
      variant={isPublic ? "primary" : "surface"}
    >
      <Icon data-icon={iconOnly ? undefined : "inline-start"} />
      {iconOnly ? null : label}
    </Badge>
  );
};
