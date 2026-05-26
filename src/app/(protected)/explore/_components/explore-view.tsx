"use client";

import { Heart, List, ListFilter, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import type { RankedListSummary } from "@/features/lists/types";
import { FollowButton } from "@/features/social/components/follow-button";
import { EmptyState } from "@/shared/components/empty-state";
import {
  SegmentedToggleGroup,
  SegmentedToggleGroupItem,
} from "@/shared/components/segmented-toggle-group";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { Profile } from "@/shared/types";
import {
  getProfileHref,
  getProfileInitials,
  getProfileUsernameLabel,
} from "@/shared/utils/profile";

type ExploreSort = "following" | "newest" | "trending";

type ExplorePersonStats = {
  likeCount: number;
  publicListCount: number;
  topics: string[];
};

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
  const people = useMemo(
    () => buildPeopleCards(lists, profiles, currentUserId),
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

  const filteredPeople = useMemo(() => {
    const normalizedQuery = userQuery.trim().toLowerCase();

    if (!normalizedQuery) return people;

    return people.filter(({ profile, stats }) =>
      [profile.displayName, profile.username, ...stats.topics]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [people, userQuery]);

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
              Search people
            </Label>
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              className="h-9 pl-9"
              id="explore-user-search"
              onChange={(event) => setUserQuery(event.target.value)}
              placeholder="Search people..."
              value={userQuery}
            />
          </div>
        </div>
        {filteredPeople.length ? (
          <div className="scrollbar-themed -mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            <div className="flex w-max min-w-full snap-x gap-3">
              {filteredPeople.map((person) => (
                <ExploreUserCard
                  currentUserId={currentUserId}
                  key={person.profile.id}
                  profile={person.profile}
                  isFollowing={followingIds.includes(person.profile.id)}
                  stats={person.stats}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyExploreBlock
            title={
              people.length ? "No people match that search." : "No people yet."
            }
            description={
              people.length
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
                <SegmentedToggleGroupItem key={topicOption} value={topicOption}>
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
                footerMode="explore"
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
  stats: ExplorePersonStats;
}) {
  const usernameLabel = getProfileUsernameLabel(profile);

  return (
    <Card
      as="article"
      className="min-h-40 w-64 shrink-0 snap-start gap-0 p-4"
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

      <div className="mt-auto flex items-center justify-between gap-2 pt-6">
        <div className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs font-bold">
          <ExploreUserStatPill
            icon={<List className="size-3.5" />}
            label={pluralize(stats.publicListCount, "list")}
            value={stats.publicListCount}
          />
          <ExploreUserStatPill
            icon={<Heart className="size-3.5" />}
            label={pluralize(stats.likeCount, "like")}
            value={stats.likeCount}
          />
        </div>
        {profile.id !== currentUserId ? (
          <FollowButton
            className="relative z-10"
            initialIsFollowing={isFollowing}
            profileId={profile.id}
            size="xs"
          />
        ) : null}
      </div>
    </Card>
  );
}

function ExploreUserStatPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <span
      aria-label={`${value} ${label}`}
      className="border-border bg-background inline-flex h-7 items-center gap-1 rounded-full border px-2"
      title={`${value} ${label}`}
    >
      {icon}
      {value}
    </span>
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

function buildPeopleCards(
  lists: RankedListSummary[],
  profiles: Profile[],
  currentUserId: string,
) {
  const listsByProfileId = new Map<string, RankedListSummary[]>();

  for (const list of lists) {
    if (!list.owner) continue;

    const ownerLists = listsByProfileId.get(list.owner.id) ?? [];
    ownerLists.push(list);
    listsByProfileId.set(list.owner.id, ownerLists);
  }

  return profiles
    .filter((profile) => profile.id !== currentUserId)
    .map((profile) => ({
      profile,
      stats: buildStats(listsByProfileId.get(profile.id) ?? []),
    }));
}

function buildStats(lists: RankedListSummary[]): ExplorePersonStats {
  return {
    likeCount: lists.reduce((sum, list) => sum + list.social.likeCount, 0),
    publicListCount: lists.length,
    topics: Array.from(
      new Set(lists.map((list) => list.topic).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b)),
  };
}

function pluralize(value: number, singular: string) {
  return value === 1 ? singular : `${singular}s`;
}
