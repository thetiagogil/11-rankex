import { Compass } from "lucide-react";

import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import { getPublicListSummaries } from "@/features/lists/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { createClient } from "@/lib/supabase/server";

export default async function ExplorePage() {
  const client = await createClient();
  const lists = await getPublicListSummaries(client);

  return (
    <AppMain className="pb-16">
      <section className="flex items-start gap-4">
        <div className="bg-gradient-stage text-primary-foreground shadow-stage grid h-12 w-12 shrink-0 place-items-center rounded-lg">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <p className="text-secondary font-mono text-[10px] tracking-[0.25em] uppercase">
            explore
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight font-black sm:text-5xl">
            Public rankings
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
            Browse public Rankex lists. The MVP keeps this discovery surface
            focused on lists, topics, and curators.
          </p>
        </div>
      </section>

      <ExploreView lists={lists} />
    </AppMain>
  );
}
