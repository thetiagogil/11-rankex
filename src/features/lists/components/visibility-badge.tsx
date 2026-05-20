import { Globe2, LockKeyhole } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";

type VisibilityBadgeProps = {
  isPublic: boolean;
};

export function VisibilityBadge({ isPublic }: VisibilityBadgeProps) {
  const Icon = isPublic ? Globe2 : LockKeyhole;

  return (
    <Badge variant={isPublic ? "primary" : "surface"}>
      <Icon data-icon="inline-start" />
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
}
