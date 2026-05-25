"use client";

import { ListPlus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import type { RankedListSummary } from "@/features/lists/types";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

type DashboardListBrowserProps = {
  currentUserId: string;
  lists: RankedListSummary[];
};

type VisibilityFilter = "all" | "public" | "private";
type SortMode = "items" | "likes" | "title" | "updated";

const visibilityOptions = [
  { label: "All", value: "all" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
] as const;

const sortOptions = [
  { label: "Recently updated", value: "updated" },
  { label: "Title A-Z", value: "title" },
  { label: "Most items", value: "items" },
  { label: "Most liked", value: "likes" },
] as const;

export function DashboardListBrowser({
  currentUserId,
  lists,
}: DashboardListBrowserProps) {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [sort, setSort] = useState<SortMode>("updated");

  const filteredLists = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...lists]
      .filter((list) => {
        const matchesVisibility =
          visibility === "all" ||
          (visibility === "public" && list.isPublic) ||
          (visibility === "private" && !list.isPublic);
        const matchesQuery =
          !normalizedQuery ||
          [list.title, list.topic, list.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesVisibility && matchesQuery;
      })
      .sort((first, second) => {
        if (sort === "title") {
          return first.title.localeCompare(second.title);
        }

        if (sort === "items") {
          return (
            second.itemCount - first.itemCount ||
            second.updatedAt.localeCompare(first.updatedAt)
          );
        }

        if (sort === "likes") {
          return (
            second.social.likeCount - first.social.likeCount ||
            second.updatedAt.localeCompare(first.updatedAt)
          );
        }

        return second.updatedAt.localeCompare(first.updatedAt);
      });
  }, [lists, query, sort, visibility]);

  if (!lists.length) {
    return (
      <Card
        as="section"
        className="flex flex-col items-center justify-center border-dashed px-6 py-20 text-center"
      >
        <ListPlus className="text-muted-foreground size-10" />
        <h2 className="font-display mt-4 text-xl">No lists yet</h2>
        <p className="text-muted-foreground mt-1 max-w-md text-sm leading-6">
          Create your first ranking. You can keep it private while drafting and
          make it public when it is ready.
        </p>
        <div className="mt-6">
          <ListFormDialog redirectToList />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="sticker-sm bg-card flex flex-col gap-3 rounded-3xl p-3 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <Label className="sr-only" htmlFor="dashboard-list-search">
            Search your lists
          </Label>
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="h-9 pl-9"
            id="dashboard-list-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, topic, or description..."
            value={query}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <ToggleGroup
            aria-label="Filter lists by visibility"
            className="border-foreground/45 bg-card h-10 items-stretch overflow-hidden rounded-xl border"
            onValueChange={(value) => {
              if (value) setVisibility(value as VisibilityFilter);
            }}
            spacing={0}
            type="single"
            value={visibility}
          >
            {visibilityOptions.map((option) => (
              <ToggleGroupItem
                className="text-muted-foreground hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background h-10 rounded-xl px-3 font-mono text-xs tracking-widest uppercase"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="grid min-w-44">
            <Label className="sr-only" htmlFor="dashboard-list-sort">
              Sort lists
            </Label>
            <Select
              onValueChange={(value) => setSort(value as SortMode)}
              value={sort}
            >
              <SelectTrigger className="h-10 w-full" id="dashboard-list-sort">
                <SelectValue placeholder="Sort lists" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredLists.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => (
            <ListCard currentUserId={currentUserId} key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <Card
          as="section"
          className="flex flex-col items-center justify-center border-dashed px-6 py-16 text-center"
        >
          <p className="font-display text-xl">No lists match that view</p>
          <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
            Adjust the search, filter, or sort controls to bring more lists back
            into view.
          </p>
          <Button
            className="mt-5"
            onClick={() => {
              setQuery("");
              setVisibility("all");
              setSort("updated");
            }}
            variant="outline"
          >
            Reset filters
          </Button>
        </Card>
      )}
    </div>
  );
}
