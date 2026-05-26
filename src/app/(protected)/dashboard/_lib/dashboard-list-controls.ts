import type {
  DashboardSortMode,
  DashboardVisibilityFilter,
} from "@/app/(protected)/dashboard/_types";

export const dashboardVisibilityOptions = [
  { label: "All", value: "all" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
] satisfies Array<{
  label: string;
  value: DashboardVisibilityFilter;
}>;

export const dashboardSortOptions = [
  { label: "Recently updated", value: "updated" },
  { label: "Title A-Z", value: "title" },
  { label: "Most items", value: "items" },
  { label: "Most liked", value: "likes" },
] satisfies Array<{
  label: string;
  value: DashboardSortMode;
}>;
