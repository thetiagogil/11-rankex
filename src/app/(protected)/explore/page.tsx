import { Compass } from "lucide-react";

import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import { getPublicListSummaries } from "@/features/lists/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { createClient } from "@/lib/supabase/server";

export default async function ExplorePage() {
  const client = await createClient();
  const lists = await getPublicListSummaries(client);

  return (
    <AppMain className="pb-20">
      <section className="mt-2">
        <header className="flex items-center gap-3">
          <Compass className="size-7 text-primary" />
          <h1 className="font-display text-4xl font-black sm:text-5xl">
            Explore
          </h1>
        </header>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
          See what Rankex curators are ranking. Filter public lists by topic and
          open any ranking for the full ordered view.
        </p>
      </section>

      <ExploreView lists={lists} />
    </AppMain>
  );
}
