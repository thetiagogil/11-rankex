import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import type { ExploreViewData } from "@/app/(protected)/explore/_types";
import { AppMain } from "@/shared/components/layout/app-main";
import { PageHeader } from "@/shared/components/page-header";

export function ExplorePageView({
  currentUserId,
  followingIds,
  lists,
  profiles,
}: ExploreViewData) {
  return (
    <AppMain className="pb-20">
      <PageHeader description="Browse public rankings, discover people, and follow the topics that keep showing up in the community canon." title="Explore" />

      <ExploreView
        currentUserId={currentUserId}
        followingIds={followingIds}
        lists={lists}
        profiles={profiles}
      />
    </AppMain>
  );
}
