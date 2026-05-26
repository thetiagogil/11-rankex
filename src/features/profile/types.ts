import type { RankedListSummary } from "@/features/lists/types";
import type { ProfileSocialStats } from "@/features/social/types";
import type { Profile } from "@/shared/types";

export type ProfileListStats = {
  listCount: number;
};

export type ProfileOverview = {
  lists: RankedListSummary[];
  profile: Profile;
  social: ProfileSocialStats;
  stats: ProfileListStats;
};
