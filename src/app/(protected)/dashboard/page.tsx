import { ListPlus } from "lucide-react";

import { ListFormDialog } from "@/features/lists/components/list-form-dialog";
import { ListCard } from "@/features/lists/components/list-card";
import { getUserListSummaries } from "@/features/lists/server/queries";
import { AppMain } from "@/shared/components/layout/app-main";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { Card } from "@/shared/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const client = await createClient();
  const lists = await getUserListSummaries(client, currentUser.id);
  const publicCount = lists.filter((list) => list.isPublic).length;
  const privateCount = lists.length - publicCount;
  const itemCount = lists.reduce((sum, list) => sum + list.itemCount, 0);

  return (
    <AppMain className="pb-20">
      <section className="mt-2 max-w-3xl">
        <h1 className="font-display text-4xl leading-tight font-black sm:text-6xl">
          Welcome back,{" "}
          <em className="text-gradient-gold not-italic">
            {currentUser.profile.displayName.split(" ")[0]}
          </em>
          .
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-8">
          Curate your canon, share with the community, and see what others are
          ranking.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-4">
        <Metric label="My lists" value={lists.length} />
        <Metric label="Public" value={publicCount} />
        <Metric label="Private" value={privateCount} />
        <Metric label="Entries" value={itemCount} />
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold">Your lists</h2>
          <div className="flex items-center gap-3">
            <ButtonLink href="/explore" variant="link">
              Browse Explore
            </ButtonLink>
            <ListFormDialog redirectToList />
          </div>
        </div>

        {lists.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <Card
            as="section"
            className="bg-card/30 flex flex-col items-center justify-center border-dashed px-6 py-20 text-center"
          >
            <ListPlus className="text-muted-foreground size-10" />
            <h2 className="font-display mt-4 text-xl">No lists yet</h2>
            <p className="text-muted-foreground mt-1 max-w-md text-sm leading-6">
              Create your first ranking. You can keep it private while drafting
              and make it public when it is ready.
            </p>
            <div className="mt-6">
              <ListFormDialog redirectToList />
            </div>
          </Card>
        )}
      </section>
    </AppMain>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card as="article" className="bg-card/60 gap-0 p-5">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
        {label}
      </p>
      <p className="font-display text-gradient-gold mt-1 text-3xl font-bold">
        {value}
      </p>
    </Card>
  );
}
