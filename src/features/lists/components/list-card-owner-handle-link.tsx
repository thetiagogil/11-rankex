import Link from "next/link";

import type { RankedListSummary } from "@/features/lists/types";
import { cn } from "@/shared/utils/cn";
import {
  getProfileHref,
  getProfileUsernameLabel,
} from "@/shared/utils/profile";

type ListCardOwnerHandleLinkProps = {
  className?: string;
  owner: NonNullable<RankedListSummary["owner"]>;
};

export const ListCardOwnerHandleLink = ({
  className,
  owner,
}: ListCardOwnerHandleLinkProps) => {
  const ownerHandle = getProfileUsernameLabel(owner);

  if (!ownerHandle) return null;

  return (
    <Link
      className={cn(
        "text-muted-foreground hover:text-primary relative z-30 min-w-0 truncate text-xs font-bold transition",
        className,
      )}
      href={getProfileHref(owner)}
    >
      {ownerHandle}
    </Link>
  );
};
