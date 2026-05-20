import { Compass, Search, UsersRound } from "lucide-react";

import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import { getPublicListSummaries } from "@/features/lists/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { PageHeader } from "@/shared/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function ExplorePage() {
  const client = await createClient();
  const lists = await getPublicListSummaries(client);

  return (
    <AppMain className="pb-20">
      <PageHeader
        description="Browse public rankings, discover curators, and follow the topics that keep showing up in the community canon."
        eyebrow="Public canon"
        icon={<Compass className="size-6" />}
        meta={
          <>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/65 px-3 py-2 text-sm text-muted-foreground">
              <Search className="size-4 text-primary" />
              Filter by topic
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/65 px-3 py-2 text-sm text-muted-foreground">
              <UsersRound className="size-4 text-primary" />
              Curators included
            </span>
          </>
        }
        title="Explore"
      />

      <ExploreView lists={lists} />
    </AppMain>
  );
}
