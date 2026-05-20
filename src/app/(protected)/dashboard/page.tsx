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
  const itemCount = lists.reduce((sum, list) => sum + list.itemCount, 0);

  return (
    <AppMain className="pb-16">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-secondary font-mono text-[10px] tracking-[0.25em] uppercase">
            dashboard
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight font-black sm:text-5xl">
            Welcome back, {currentUser.profile.displayName.split(" ")[0]}.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
            Manage your ranked lists, tune visibility, and keep the order
            current as your taste changes.
          </p>
        </div>
        <ListFormDialog redirectToList />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric label="Lists" value={lists.length} />
        <Metric label="Public" value={publicCount} />
        <Metric label="Ranked items" value={itemCount} />
      </section>

      <section className="mt-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Your lists</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Private drafts and public rankings live together here.
            </p>
          </div>
          <ButtonLink href="/explore" variant="outline">
            Browse Explore
          </ButtonLink>
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
            className="flex flex-col items-center justify-center border-dashed px-6 py-16 text-center"
          >
            <ListPlus className="text-muted-foreground h-10 w-10" />
            <h2 className="font-display mt-4 text-2xl font-bold">
              No lists yet
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
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
    <Card as="article" className="p-5">
      <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
        {label}
      </p>
      <p className="font-display text-gradient-stage mt-2 text-4xl font-bold">
        {value}
      </p>
    </Card>
  );
}
