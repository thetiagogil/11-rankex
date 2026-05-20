import { Globe2, LockKeyhole } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";

type VisibilityBadgeProps = {
  isPublic: boolean;
};

export function VisibilityBadge({ isPublic }: VisibilityBadgeProps) {
  const Icon = isPublic ? Globe2 : LockKeyhole;

  return (
    <Badge variant={isPublic ? "primary" : "surface"}>
      <Icon className="mr-1 h-3 w-3" />
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
}
