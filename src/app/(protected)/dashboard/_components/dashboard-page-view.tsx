import { DashboardListBrowser } from "@/app/(protected)/dashboard/_components/dashboard-list-browser";
import { DashboardMetricCard } from "@/app/(protected)/dashboard/_components/dashboard-metric-card";
import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import type { RankedListSummary } from "@/features/lists/types";
import type { ProfileSocialStats } from "@/features/social/types";
import { AppMain } from "@/shared/components/layout/app-main";
import { PageHeader } from "@/shared/components/page-header";

type DashboardPageViewProps = {
  currentUserId: string;
  displayName: string;
  lists: RankedListSummary[];
  social: ProfileSocialStats;
};

export function DashboardPageView({
  currentUserId,
  displayName,
  lists,
  social,
}: DashboardPageViewProps) {
  const firstName = displayName.split(" ")[0] ?? displayName;

  return (
    <AppMain className="pb-20">
      <PageHeader
        description="Build your canon, share with the community, and see what others are ranking."
        title={
          <>
            Welcome back,{" "}
            <em className="text-gradient-gold not-italic">{firstName}</em>
          </>
        }
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-4">
        <DashboardMetricCard
          accent="primary"
          label="My lists"
          value={lists.length}
        />
        <DashboardMetricCard
          accent="accent"
          label="Likes"
          value={social.likesReceivedCount}
        />
        <DashboardMetricCard
          accent="cyan"
          label="Following"
          value={social.followingCount}
        />
        <DashboardMetricCard
          accent="gold"
          label="Bookmarks"
          value={social.savedListCount}
        />
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold">Your lists</h2>
          <ListFormDialog redirectToList />
        </div>

        <DashboardListBrowser currentUserId={currentUserId} lists={lists} />
      </section>
    </AppMain>
  );
}
