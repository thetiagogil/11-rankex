import { ExploreView } from "@/app/(protected)/explore/_components/explore-view";
import { getPublicListSummaries } from "@/features/lists/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { createClient } from "@/lib/supabase/server";

export default async function ExplorePage() {
  const client = await createClient();
  const lists = await getPublicListSummaries(client);

  return (
    <AppMain className="pb-20">
      <section className="mt-2 max-w-3xl">
        <h1 className="font-display text-4xl leading-tight font-black sm:text-6xl">
          Explore
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Browse public rankings, discover curators, and follow the topics that
          keep showing up in the community canon.
        </p>
      </section>

      <ExploreView lists={lists} />
    </AppMain>
  );
}
