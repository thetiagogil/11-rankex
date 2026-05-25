"use client";

import { ListFilter, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import type { RankedListSummary } from "@/features/lists/types";
import type { ProfileListStats } from "@/features/profile/types";
import { FollowButton } from "@/features/social/components/follow-button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  SegmentedToggleGroup,
  SegmentedToggleGroupItem,
} from "@/shared/components/segmented-toggle-group";
import type { Profile } from "@/shared/types";
import { getProfileHref, getProfileInitials } from "@/shared/utils/profile";

type ExploreSort = "following" | "newest" | "trending";

type ExploreViewProps = {
  currentUserId: string;
  followingIds: string[];
  lists: RankedListSummary[];
  profiles: Profile[];
};

export function ExploreView({
  currentUserId,
  followingIds,
  lists,
  profiles,
}: ExploreViewProps) {
  const [query, setQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [sort, setSort] = useState<ExploreSort>("trending");
  const curators = useMemo(
    () =>
      buildCuratorCards(
        lists,
        profiles.filter((profile) => profile.id !== currentUserId),
      ),
    [currentUserId, lists, profiles],
  );
  const topics = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(lists.map((list) => list.topic).filter(Boolean) as string[]),
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [lists],
  );

  const filteredCurators = useMemo(() => {
    const normalizedQuery = userQuery.trim().toLowerCase();

    if (!normalizedQuery) return curators;

    return curators.filter(({ profile, stats }) =>
      [profile.displayName, profile.username, ...stats.topics]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [curators, userQuery]);

  const filteredLists = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = lists.filter((list) => {
      const matchesTopic = topic === "All" || list.topic === topic;
      const matchesQuery =
        !normalizedQuery ||
        [list.title, list.topic, list.description, list.owner?.displayName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesTopic && matchesQuery;
    });

    const scoped =
      sort === "following"
        ? filtered.filter((list) => followingIds.includes(list.ownerId))
        : filtered;

    return [...scoped].sort((a, b) => {
      if (sort === "newest" || sort === "following") {
        return b.updatedAt.localeCompare(a.updatedAt);
      }

      return (
        b.social.likeCount +
          b.social.commentCount -
          (a.social.likeCount + a.social.commentCount) ||
        b.updatedAt.localeCompare(a.updatedAt)
      );
    });
  }, [followingIds, lists, query, sort, topic]);

  return (
    <div className="mt-10 flex flex-col gap-12">
      <section>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-2xl font-bold">People to follow</h2>
          <div className="relative w-full lg:max-w-xs">
            <Label className="sr-only" htmlFor="explore-user-search">
              Search users
            </Label>
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              className="h-9 pl-9"
              id="explore-user-search"
              onChange={(event) => setUserQuery(event.target.value)}
              placeholder="Search users..."
              value={userQuery}
            />
          </div>
        </div>
        {filteredCurators.length ? (
          <div className="scrollbar-themed -mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            <div className="flex w-max min-w-full snap-x gap-3">
              {filteredCurators.map((curator) => (
                <ExploreUserCard
                  currentUserId={currentUserId}
                  key={curator.profile.id}
                  profile={curator.profile}
                  isFollowing={followingIds.includes(curator.profile.id)}
                  stats={curator.stats}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyExploreBlock
            title={
              curators.length ? "No users match that search." : "No users yet."
            }
            description={
              curators.length
                ? "Try another name, handle, or topic."
                : "Public profiles will surface here."
            }
          />
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <ListFilter className="text-primary size-5" />
          <h2 className="font-display text-2xl font-bold">Public lists</h2>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <SegmentedToggleGroup
              aria-label="Sort public lists"
              onValueChange={(value) => {
                if (value) setSort(value as ExploreSort);
              }}
              type="single"
              value={sort}
              wrap
            >
              {(["trending", "newest", "following"] as const).map(
                (sortOption) => (
                  <SegmentedToggleGroupItem key={sortOption} value={sortOption}>
                    {sortOption === "trending" ? (
                      <TrendingUp data-icon="inline-start" />
                    ) : null}
                    {sortOption}
                  </SegmentedToggleGroupItem>
                ),
              )}
            </SegmentedToggleGroup>

            <SegmentedToggleGroup
              aria-label="Filter public lists by topic"
              className="w-full lg:w-auto"
              onValueChange={(value) => {
                if (value) setTopic(value);
              }}
              type="single"
              value={topic}
              wrap
            >
              {topics.map((topicOption) => (
                <SegmentedToggleGroupItem
                  key={topicOption}
                  value={topicOption}
                >
                  {topicOption}
                </SegmentedToggleGroupItem>
              ))}
            </SegmentedToggleGroup>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Label className="sr-only" htmlFor="explore-list-search">
              Search lists
            </Label>
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              className="h-9 pl-9"
              id="explore-list-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search public lists..."
              value={query}
            />
          </div>
        </div>

        {filteredLists.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLists.map((list) => (
              <ListCard
                currentUserId={currentUserId}
                key={list.id}
                list={list}
                showOwner
              />
            ))}
          </div>
        ) : (
          <EmptyExploreBlock
            title="No public lists match that view."
            description="Try a different topic or search term."
          />
        )}
      </section>
    </div>
  );
}

function ExploreUserCard({
  currentUserId,
  isFollowing,
  profile,
  stats,
}: {
  currentUserId: string;
  isFollowing: boolean;
  profile: Profile;
  stats: ProfileListStats;
}) {
  return (
    <Card
      as="article"
      className="w-60 shrink-0 snap-start p-4"
      variant="shadow"
    >
      <div className="flex items-start gap-3">
        <Link
          className="border-foreground/45 bg-gradient-gold font-display text-primary-foreground grid size-14 shrink-0 place-items-center rounded-2xl border text-2xl font-black shadow-none"
          href={getProfileHref(profile)}
        >
          {getProfileInitials(profile.displayName)}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            className="font-display hover:text-primary block truncate text-2xl leading-none font-bold transition"
            href={getProfileHref(profile)}
          >
            {profile.displayName}
          </Link>
          <p className="text-primary truncate font-mono text-xs">
            {profile.username ? `@${profile.username}` : "Rankex curator"}
          </p>
        </div>
      </div>

      <div className="border-border mt-4 flex items-center justify-between gap-3 border-t border-dashed pt-4">
        <p className="text-muted-foreground text-xs leading-5">
          <span className="font-display text-foreground text-base font-bold">
            {stats.publicListCount}
          </span>{" "}
          public lists / {stats.itemCount} ranked
        </p>
        {profile.id !== currentUserId ? (
          <FollowButton
            initialIsFollowing={isFollowing}
            profileId={profile.id}
          />
        ) : null}
      </div>
    </Card>
  );
}

function EmptyExploreBlock({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return <EmptyState description={description} title={title} />;
}

function buildCuratorCards(lists: RankedListSummary[], profiles: Profile[]) {
  const curators = new Map<
    string,
    {
      lists: RankedListSummary[];
      profile: Profile;
    }
  >();

  for (const list of lists) {
    if (!list.owner) continue;

    const current = curators.get(list.owner.id);
    if (current) {
      current.lists.push(list);
    } else {
      curators.set(list.owner.id, { lists: [list], profile: list.owner });
    }
  }

  for (const profile of profiles) {
    if (!curators.has(profile.id)) {
      curators.set(profile.id, { lists: [], profile });
    }
  }

  return Array.from(curators.values())
    .map(({ lists: curatorLists, profile }) => ({
      profile,
      stats: buildStats(curatorLists),
    }))
    .sort(
      (a, b) =>
        b.stats.publicListCount - a.stats.publicListCount ||
        b.stats.itemCount - a.stats.itemCount ||
        a.profile.displayName.localeCompare(b.profile.displayName),
    );
}

function buildStats(lists: RankedListSummary[]): ProfileListStats {
  return {
    itemCount: lists.reduce((sum, list) => sum + list.itemCount, 0),
    listCount: lists.length,
    publicListCount: lists.length,
    topics: Array.from(
      new Set(lists.map((list) => list.topic).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b)),
  };
}
