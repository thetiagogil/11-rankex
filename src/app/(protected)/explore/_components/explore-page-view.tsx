import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import type { ExploreViewData } from "@/app/(protected)/explore/_types";
import { AppMain } from "@/shared/components/layout/app-main";
import { PageHeader } from "@/shared/components/page-header";

export const ExplorePageView = ({
  currentUserId,
  followingIds,
  lists,
  profiles,
}: ExploreViewData) => {
  return (
    <AppMain className="pb-20">
      <PageHeader
        description="Find public lists, follow people with similar taste, and save the rankings you want to revisit."
        title="Explore"
      />

      <ExploreView
        currentUserId={currentUserId}
        followingIds={followingIds}
        lists={lists}
        profiles={profiles}
      />
    </AppMain>
  );
};
