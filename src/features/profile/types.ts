import type { RankedListSummary } from "@/features/lists/types";
import type { Profile } from "@/shared/types";

export type ProfileListStats = {
  itemCount: number;
  listCount: number;
  publicListCount: number;
  topics: string[];
};

export type ProfileOverview = {
  lists: RankedListSummary[];
  profile: Profile;
  stats: ProfileListStats;
};
