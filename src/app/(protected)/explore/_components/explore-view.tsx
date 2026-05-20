"use client";

import { ListFilter, Search, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import type { RankedListSummary } from "@/features/lists/types";
import { ProfileCard } from "@/features/profile/components/profile-card";
import type { ProfileListStats } from "@/features/profile/types";
import { Input } from "@/shared/components/ui/input";
import type { Profile } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type ExploreViewProps = {
  lists: RankedListSummary[];
};

export function ExploreView({ lists }: ExploreViewProps) {
  const [query, setQuery] = useState("");
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
        <div className="mb-5 flex items-center gap-2">
          <UsersRound className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">
            Curators to browse
          </h2>
        </div>
        {curators.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {curators.map((curator) => (
              <ProfileCard
                key={curator.profile.id}
                profile={curator.profile}
                stats={curator.stats}
              />
            ))}
          </div>
        ) : (
          <EmptyExploreBlock
            title="No curators published yet."
            description="Public lists will surface curator cards here."
          />
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <ListFilter className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Public lists</h2>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topicOption) => (
              <button
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs tracking-widest uppercase transition",
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
              className="pl-9"
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
    )
    .slice(0, 6);
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
