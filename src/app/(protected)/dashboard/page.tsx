import { DashboardListBrowser } from "@/app/(protected)/dashboard/_components/dashboard-list-browser";
import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import { getUserListSummaries } from "@/features/lists/server/queries";
import { getProfileSocialStats } from "@/features/social/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { Card } from "@/shared/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";
import { cn } from "@/shared/utils/cn";

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const client = await createClient();
  const [lists, social] = await Promise.all([
    getUserListSummaries(client, currentUser.id),
    getProfileSocialStats(client, currentUser.id, currentUser.id),
  ]);

  return (
    <AppMain className="pb-20">
      <section className="mt-2 max-w-3xl">
        <h1 className="font-display text-4xl leading-tight font-black sm:text-6xl">
          Welcome back,{" "}
          <em className="text-gradient-gold not-italic">
            {currentUser.profile.displayName.split(" ")[0]}
          </em>
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-8">
          Curate your canon, share with the community, and see what others are
          ranking.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-4">
        <Metric accent="primary" label="My lists" value={lists.length} />
        <Metric
          accent="accent"
          label="Likes"
          value={social.likesReceivedCount}
        />
        <Metric accent="cyan" label="Following" value={social.followingCount} />
        <Metric accent="gold" label="Bookmarks" value={social.savedListCount} />
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold">Your lists</h2>
          <ListFormDialog redirectToList />
        </div>

        <DashboardListBrowser currentUserId={currentUser.id} lists={lists} />
      </section>
    </AppMain>
  );
}

function Metric({
  accent,
  label,
  value,
}: {
  accent: "accent" | "cyan" | "gold" | "primary";
  label: string;
  value: number;
}) {
  return (
    <Card as="article" className="gap-0 p-5" variant="shadow">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
        {label}
      </p>
      <p
        className={cn(
          "font-display mt-2 text-5xl leading-none font-bold",
          accent === "primary" && "text-primary",
          accent === "accent" && "text-accent",
          accent === "cyan" && "text-cyan",
          accent === "gold" && "text-gold",
        )}
      >
        {value}
      </p>
    </Card>
  );
}
