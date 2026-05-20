"use client";

import { ListFilter, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import type { RankedListSummary } from "@/features/lists/types";
import type { ProfileListStats } from "@/features/profile/types";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import type { Profile } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { getProfileHref, getProfileInitials } from "@/shared/utils/profile";

type ExploreViewProps = {
  lists: RankedListSummary[];
};

export function ExploreView({ lists }: ExploreViewProps) {
  const [query, setQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const curators = useMemo(() => buildCuratorCards(lists), [lists]);
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
      [
        profile.displayName,
        profile.username,
        profile.bio,
        ...stats.topics,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [curators, userQuery]);

  const filteredLists = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return lists.filter((list) => {
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
  }, [lists, query, topic]);

  return (
    <div className="mt-10 flex flex-col gap-12">
      <section>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-2xl font-bold">
            Curators to browse
          </h2>
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search users</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 pl-9"
              onChange={(event) => setUserQuery(event.target.value)}
              placeholder="Search users..."
              value={userQuery}
            />
          </label>
        </div>
        {filteredCurators.length ? (
          <div className="-mx-4 overflow-x-auto px-4 pb-3 scrollbar-themed sm:mx-0 sm:px-0">
            <div className="flex min-w-max gap-4">
              {filteredCurators.map((curator) => (
                <ExploreUserCard
                  key={curator.profile.id}
                  profile={curator.profile}
                  stats={curator.stats}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyExploreBlock
            title={
              curators.length ? "No curators match that search." : "No curators published yet."
            }
            description={
              curators.length
                ? "Try another name, handle, or topic."
                : "Public lists will surface curator cards here."
            }
          />
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <ListFilter className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Public lists</h2>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="flex flex-wrap items-stretch gap-1.5">
            {topics.map((topicOption) => (
              <button
                className={cn(
                  "h-9 rounded-full border px-3 font-mono text-xs tracking-widest uppercase transition",
                  topic === topicOption
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
                key={topicOption}
                onClick={() => setTopic(topicOption)}
                type="button"
              >
                {topicOption}
              </button>
            ))}
          </div>

          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search lists</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search public lists..."
              value={query}
            />
          </label>
        </div>

        {filteredLists.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLists.map((list) => (
              <ListCard key={list.id} list={list} showOwner />
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
  profile,
  stats,
}: {
  profile: Profile;
  stats: ProfileListStats;
}) {
  return (
    <Card
      as="article"
      className="w-72 shrink-0 bg-card/65 p-4 transition hover:border-primary/45"
    >
      <div className="flex items-start gap-3">
        <Link
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-gold font-display text-lg font-black text-primary-foreground shadow-glow"
          href={getProfileHref(profile)}
        >
          {getProfileInitials(profile.displayName)}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            className="block truncate font-display text-lg font-bold transition hover:text-primary"
            href={getProfileHref(profile)}
          >
            {profile.displayName}
          </Link>
          <p className="truncate font-mono text-xs text-primary">
            {profile.username ? `@${profile.username}` : "Rankex curator"}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {profile.bio || "Collecting rankings, tiers, and lists worth revisiting."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-xs leading-5 text-muted-foreground">
          <span className="font-display text-base font-bold text-foreground">
            {stats.publicListCount}
          </span>{" "}
          public lists / {stats.itemCount} ranked
        </p>
        <Button size="sm" type="button" variant="outline">
          <UserPlus data-icon="inline-start" />
          Follow
        </Button>
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
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
      <p className="font-display text-xl">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function buildCuratorCards(lists: RankedListSummary[]) {
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
