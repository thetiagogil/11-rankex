"use client";

import { ListFilter, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { ExploreUserCard } from "@/app/(protected)/explore/_components/explore-user-card";
import {
  buildExplorePeople,
  filterAndSortExploreLists,
  filterExplorePeople,
} from "@/app/(protected)/explore/_lib/explore-filters";
import type {
  ExploreSort,
  ExploreViewData,
} from "@/app/(protected)/explore/_types";
import { ListCard } from "@/features/lists/components/list-card";
import { ControlBar, ControlBarGroup } from "@/shared/components/control-bar";
import { EmptyState } from "@/shared/components/empty-state";
import { SearchInput } from "@/shared/components/search-input";
import {
  SegmentedToggleGroup,
  SegmentedToggleGroupItem,
} from "@/shared/components/segmented-toggle-group";

export const ExploreView = ({
  currentUserId,
  followingIds,
  lists,
  profiles,
}: ExploreViewData) => {
  const [query, setQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [sort, setSort] = useState<ExploreSort>("trending");
  const people = useMemo(
    () => buildExplorePeople(lists, profiles, currentUserId),
    [currentUserId, lists, profiles],
  );

  const filteredPeople = useMemo(() => {
    return filterExplorePeople(people, userQuery);
  }, [people, userQuery]);

  const filteredLists = useMemo(() => {
    return filterAndSortExploreLists({
      followingIds,
      lists,
      query,
      sort,
    });
  }, [followingIds, lists, query, sort]);

  return (
    <div className="mt-10 flex flex-col gap-12">
      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold">People to follow</h2>
          <SearchInput
            className="lg:max-w-xs"
            id="explore-user-search"
            inputClassName="h-9"
            label="Search people"
            onChange={(event) => setUserQuery(event.target.value)}
            placeholder="Search people..."
            value={userQuery}
          />
        </div>
        {filteredPeople.length ? (
          <div className="scrollbar-themed -mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            <div className="flex w-max min-w-full snap-x gap-4">
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
          <EmptyState
            title={
              people.length ? "No people match that search." : "No people yet."
            }
            description={
              people.length
                ? "Try another name, handle, or topic."
                : "Public profiles will appear here."
            }
          />
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <ListFilter className="text-primary size-5" />
          <h2 className="font-display text-2xl font-bold">Public lists</h2>
        </div>

        <ControlBar>
          <SearchInput
            className="min-w-0 flex-1"
            id="explore-list-search"
            inputClassName="border-foreground/25 bg-background/35 focus-visible:border-primary/45 h-10 rounded-2xl shadow-none"
            label="Search public lists by title or category"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or category..."
            value={query}
          />

          <ControlBarGroup className="gap-3">
            <SegmentedToggleGroup
              aria-label="Sort public lists"
              onValueChange={(value) => {
                if (value) setSort(value as ExploreSort);
              }}
              type="single"
              value={sort}
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
          </ControlBarGroup>
        </ControlBar>

        {filteredLists.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <EmptyState
            title="No public lists match that view"
            description="Try another search or category."
          />
        )}
      </section>
    </div>
  );
};
