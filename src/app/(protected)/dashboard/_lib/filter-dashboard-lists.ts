import type {
  DashboardSortMode,
  DashboardVisibilityFilter,
} from "@/app/(protected)/dashboard/_types";
import type { RankedListSummary } from "@/features/lists/types";

export const filterDashboardLists = ({
  lists,
  query,
  sort,
  visibility,
}: {
  lists: RankedListSummary[];
  query: string;
  sort: DashboardSortMode;
  visibility: DashboardVisibilityFilter;
}) => {
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
};
