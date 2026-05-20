"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import type { RankedListSummary } from "@/features/lists/types";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

type ExploreViewProps = {
  lists: RankedListSummary[];
};

export function ExploreView({ lists }: ExploreViewProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
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
    <section className="mt-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {topics.map((topicOption) => (
            <button
              className={cn(
                "rounded-md border px-3 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition",
                topic === topicOption
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-surface",
              )}
              key={topicOption}
              onClick={() => setTopic(topicOption)}
              type="button"
            >
              {topicOption}
            </button>
          ))}
        </div>

        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search lists</span>
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search public lists..."
            value={query}
          />
        </label>
      </div>

      {filteredLists.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => (
            <ListCard key={list.id} list={list} showOwner />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card/40 mt-6 rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="font-display text-xl">No public lists match that view.</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Try a different topic or search term.
          </p>
        </div>
      )}
    </section>
  );
}
