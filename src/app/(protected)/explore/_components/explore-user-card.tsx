import { Heart, List } from "lucide-react";
import Link from "next/link";

import type { ExplorePersonStats } from "@/app/(protected)/explore/_types";
import { FollowButton } from "@/features/social/components/follow-button";
import { CountPill } from "@/shared/components/count-pill";
import { ProfileAvatar } from "@/shared/components/profile-avatar";
import { Card } from "@/shared/components/ui/card";
import type { Profile } from "@/shared/types";
import {
  getProfileHref,
  getProfileUsernameLabel,
} from "@/shared/utils/profile";

type ExploreUserCardProps = {
  currentUserId: string;
  isFollowing: boolean;
  profile: Profile;
  stats: ExplorePersonStats;
};

export function ExploreUserCard({
  currentUserId,
  isFollowing,
  profile,
  stats,
}: ExploreUserCardProps) {
  const usernameLabel = getProfileUsernameLabel(profile);

  return (
    <Card
      as="article"
      className="w-72 shrink-0 snap-start gap-5 p-4"
      variant="shadow"
    >
      <div className="flex items-start gap-3">
        <Link
          className="shrink-0"
          href={getProfileHref(profile)}
        >
          <ProfileAvatar displayName={profile.displayName} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            className="font-display hover:text-primary block truncate text-2xl leading-tight font-bold transition"
            href={getProfileHref(profile)}
          >
            {profile.displayName}
          </Link>
          {usernameLabel ? (
            <p className="text-primary truncate font-mono text-xs">
              {usernameLabel}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs font-bold">
          <CountPill
            icon={<List data-icon="inline-start" />}
            singularLabel="list"
            value={stats.publicListCount}
          />
          <CountPill
            icon={<Heart data-icon="inline-start" />}
            singularLabel="like"
            value={stats.likeCount}
          />
        </div>
        {profile.id !== currentUserId ? (
          <FollowButton
            className="relative z-10"
            initialIsFollowing={isFollowing}
            profileId={profile.id}
            size="sm"
          />
        ) : null}
      </div>
    </Card>
  );
}
