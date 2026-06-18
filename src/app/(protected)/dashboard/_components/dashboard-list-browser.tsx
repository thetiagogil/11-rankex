"use client";

import { useMemo, useState } from "react";

import {
  dashboardSortOptions,
  dashboardVisibilityOptions,
} from "@/app/(protected)/dashboard/_lib/dashboard-list-controls";
import { filterDashboardLists } from "@/app/(protected)/dashboard/_lib/filter-dashboard-lists";
import type {
  DashboardSortMode,
  DashboardVisibilityFilter,
} from "@/app/(protected)/dashboard/_types";
import { ListCard } from "@/features/lists/components/list-card";
import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import type { RankedListSummary } from "@/features/lists/types";
import { ControlBar, ControlBarGroup } from "@/shared/components/control-bar";
import { EmptyState } from "@/shared/components/empty-state";
import { SearchInput } from "@/shared/components/search-input";
import {
  SegmentedToggleGroup,
  SegmentedToggleGroupItem,
} from "@/shared/components/segmented-toggle-group";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type DashboardListBrowserProps = {
  currentUserId: string;
  lists: RankedListSummary[];
};

export const DashboardListBrowser = ({
  currentUserId,
  lists,
}: DashboardListBrowserProps) => {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] =
    useState<DashboardVisibilityFilter>("all");
  const [sort, setSort] = useState<DashboardSortMode>("updated");

  const filteredLists = useMemo(() => {
    return filterDashboardLists({ lists, query, sort, visibility });
  }, [lists, query, sort, visibility]);

  if (!lists.length) {
    return (
      <EmptyState
        action={<ListFormDialog redirectToList />}
        className="py-20"
        description="Create your first list. Keep it private while drafting, then publish it when it is ready."
        title="No lists yet"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ControlBar>
        <SearchInput
          className="min-w-0 flex-1"
          id="dashboard-list-search"
          inputClassName="border-foreground/25 bg-background/35 focus-visible:border-primary/45 h-10 rounded-2xl shadow-none"
          label="Search your lists"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, topic, or description..."
          value={query}
        />

        <ControlBarGroup className="gap-3">
          <SegmentedToggleGroup
            aria-label="Filter lists by visibility"
            onValueChange={(value) => {
              if (value) setVisibility(value as DashboardVisibilityFilter);
            }}
            type="single"
            value={visibility}
          >
            {dashboardVisibilityOptions.map((option) => (
              <SegmentedToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </SegmentedToggleGroupItem>
            ))}
          </SegmentedToggleGroup>

          <div className="grid min-w-44">
            <Select
              onValueChange={(value) => setSort(value as DashboardSortMode)}
              value={sort}
            >
              <SelectTrigger
                aria-label="Sort lists"
                className="border-foreground/25 bg-background/35 focus-visible:border-primary/45 h-10 w-full rounded-2xl shadow-none"
                id="dashboard-list-sort"
              >
                <SelectValue placeholder="Sort lists" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {dashboardSortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </ControlBarGroup>
      </ControlBar>

      {filteredLists.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => (
            <ListCard currentUserId={currentUserId} key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button
              onClick={() => {
                setQuery("");
                setVisibility("all");
                setSort("updated");
              }}
              variant="outline"
            >
              Reset filters
            </Button>
          }
          description="Try a different search or reset your filters."
          title="No lists match that view"
        />
      )}
    </div>
  );
};
