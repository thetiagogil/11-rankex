import { Settings } from "lucide-react";

import { ListCard } from "@/features/lists/components/list-card";
import type { ProfileOverview } from "@/features/profile/types";
import { FollowButton } from "@/features/social/components/follow-button";
import { ButtonLink } from "@/shared/components/button-link";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state";
import { getProfileInitials } from "@/shared/utils/profile";

type ProfilePageViewProps = {
  currentUserId?: string;
  isCurrentUser?: boolean;
  overview: ProfileOverview;
};

export function ProfilePageView({
  currentUserId,
  isCurrentUser = false,
  overview,
}: ProfilePageViewProps) {
  const { lists, profile, social, stats } = overview;
  const emptyCopy = isCurrentUser
    ? "Create a list from the dashboard to start building out your public profile."
    : "This curator has not published a list yet.";
  const bio =
    profile.bio ||
    "A Rankex curator building ordered lists, tiers, and personal canon.";

  return (
    <div className="flex min-w-0 flex-col gap-10">
      <Card as="section" className="w-full max-w-full p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="sm:block">
            <div className="border-foreground/45 bg-gradient-gold font-display text-primary-foreground shadow-elevated grid size-28 shrink-0 place-items-center rounded-3xl border text-5xl font-black sm:size-36 sm:text-6xl">
              {getProfileInitials(profile.displayName)}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="font-display truncate text-5xl leading-none font-black sm:text-6xl">
                  {profile.displayName}
                </h1>
                <p className="text-primary mt-1 truncate font-mono text-sm">
                  {profile.username ? `@${profile.username}` : "Rankex profile"}
                </p>

                {isCurrentUser ? (
                  <ButtonLink
                    className="mt-4 w-fit max-w-full sm:hidden"
                    href="/settings"
                    size="sm"
                    variant="outline"
                  >
                    <Settings data-icon="inline-start" />
                    Edit profile
                  </ButtonLink>
                ) : null}
              </div>

              {isCurrentUser ? (
                <ButtonLink
                  className="shrink-0 max-sm:hidden"
                  href="/settings"
                  variant="outline"
                >
                  <Settings data-icon="inline-start" />
                  Edit profile
                </ButtonLink>
              ) : currentUserId ? (
                <FollowButton
                  className="shrink-0 max-sm:hidden"
                  initialIsFollowing={social.isFollowedByViewer}
                  profileId={profile.id}
                  size="default"
                />
              ) : null}
            </div>

            <div className="border-border mt-5 grid grid-cols-3 gap-3 border-y border-dashed py-4 sm:hidden">
              <ProfileStat label="Lists" value={stats.listCount} />
              <ProfileStat label="Followers" value={social.followerCount} />
              <ProfileStat label="Likes" value={social.likesReceivedCount} />
            </div>

            <div className="text-muted-foreground mt-5 hidden flex-wrap gap-x-6 gap-y-2 text-sm sm:flex">
              <span>
                <strong className="font-display text-foreground text-lg">
                  {stats.listCount}
                </strong>{" "}
                lists
              </span>
              <span>
                <strong className="font-display text-foreground text-lg">
                  {social.followerCount}
                </strong>{" "}
                followers
              </span>
              <span>
                <strong className="font-display text-foreground text-lg">
                  {social.followingCount}
                </strong>{" "}
                following
              </span>
              <span>
                <strong className="font-display text-foreground text-lg">
                  {social.likesReceivedCount}
                </strong>{" "}
                likes received
              </span>
            </div>

            <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7">
              {bio}
            </p>

            {!isCurrentUser && currentUserId ? (
              <div className="mt-5 sm:hidden">
                <FollowButton
                  initialIsFollowing={social.isFollowedByViewer}
                  profileId={profile.id}
                  size="default"
                />
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold">Ranked lists</h2>
        </div>

        {lists.length ? (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard
                currentUserId={currentUserId}
                footerMode={isCurrentUser ? "default" : "explore"}
                isTilted={false}
                key={list.id}
                list={list}
                showOwner={!isCurrentUser}
              />
            ))}
          </div>
        ) : (
          <EmptyState description={emptyCopy} title="No rankings here yet" />
        )}
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <p className="font-display text-foreground text-xl leading-none font-bold">
        {value}
      </p>
      <p className="text-muted-foreground mt-1 truncate font-mono text-[10px] tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}
