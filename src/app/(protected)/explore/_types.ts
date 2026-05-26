import type { RankedListSummary } from "@/features/lists/types";
import type { Profile } from "@/shared/types";

export type ExploreSort = "following" | "newest" | "trending";

export type ExplorePersonStats = {
  likeCount: number;
  publicListCount: number;
  topics: string[];
};

export type ExplorePersonCard = {
  profile: Profile;
  stats: ExplorePersonStats;
};

export type ExploreViewData = {
  currentUserId: string;
  followingIds: string[];
  lists: RankedListSummary[];
  profiles: Profile[];
};
