import Link from "next/link";

import { ProfileAvatar } from "@/shared/components/profile-avatar";
import type { Profile } from "@/shared/types";
import { getProfileHref } from "@/shared/utils/profile";

type ListOwnerMetadataProps = {
  profile: Profile;
};

export function ListOwnerMetadata({ profile }: ListOwnerMetadataProps) {
  return (
    <Link
      className="text-muted-foreground hover:text-foreground inline-flex min-w-0 items-center gap-2 transition"
      href={getProfileHref(profile)}
    >
      <ProfileAvatar
        displayName={profile.displayName}
        rounded="full"
        size="xs"
        tone="primary"
      />
      <span className="min-w-0">
        by <span className="text-foreground">{profile.displayName}</span>
      </span>
    </Link>
  );
}
