import { Compass, GripVertical, LayoutGrid, ListOrdered, Trophy } from "lucide-react";
import { redirect } from "next/navigation";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { Card } from "@/shared/components/ui/card";
import { getCurrentUser } from "@/shared/server/auth";

const featureCards = [
  {
    icon: ListOrdered,
    title: "Ranked lists",
    description: "Build ordered lists with notes, scores, and clear ownership.",
  },
  {
    icon: LayoutGrid,
    title: "Tier view",
    description: "Switch from exact order to S/A/B/C/D tiers when ranking gets fuzzy.",
  },
  {
    icon: GripVertical,
    title: "Drag reorder",
    description: "Move entries quickly and preserve the final ranking in Supabase.",
  },
  {
    icon: Compass,
    title: "Explore public lists",
    description: "Browse public rankings without bringing in social-feed complexity.",
  },
] as const;

export default async function LandingPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <AppShell>
      <AppHeader
        actions={
          <>
            <ButtonLink href="/auth" size="sm" variant="ghost">
              Log in
            </ButtonLink>
            <ButtonLink href="/auth?mode=signup" size="sm">
              Get started
            </ButtonLink>
          </>
        }
      />

      <AppMain className="pb-16">
        <section className="grid min-h-[calc(100dvh-9rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="bg-gradient-stage text-primary-foreground shadow-stage mb-8 grid h-14 w-14 place-items-center rounded-xl">
              <Trophy className="h-7 w-7" />
            </div>
            <h1 className="font-display text-5xl leading-[0.95] font-black text-balance sm:text-7xl">
              Rank what matters. Share what holds up.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
              Rankex is a focused workspace for top lists: private drafts,
              public rankings, item notes, scores, tiers, and fast reorder flows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/auth?mode=signup" size="lg">
                Start ranking
              </ButtonLink>
              <ButtonLink href="/auth" size="lg" variant="outline">
                Use demo account
              </ButtonLink>
            </div>
          </div>

          <Card as="section" className="p-5" gradient tone="primary">
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-secondary font-mono text-[10px] tracking-[0.25em] uppercase">
                    Live ranking
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-bold">
                    Best late-night food
                  </h2>
                </div>
                <span className="border-primary/40 bg-primary/10 text-primary rounded-sm border px-2 py-1 font-mono text-[10px] uppercase">
                  Public
                </span>
              </div>

              <div className="space-y-3">
                {["Ramen bar", "Taco truck", "Diner pancakes", "Falafel wrap"].map(
                  (item, index) => (
                    <div
                      className="border-border bg-surface/80 flex items-center gap-3 rounded-lg border p-3"
                      key={item}
                    >
                      <span className="font-display bg-gradient-stage text-primary-foreground grid h-9 w-9 place-items-center rounded-md font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          Score {96 - index * 4}
                        </p>
                      </div>
                      <GripVertical className="text-muted-foreground h-4 w-4" />
                    </div>
                  ),
                )}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => (
            <Card as="article" className="p-5" key={feature.title}>
              <feature.icon className="text-primary h-5 w-5" />
              <h2 className="font-display mt-4 text-lg font-bold">
                {feature.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {feature.description}
              </p>
            </Card>
          ))}
        </section>
      </AppMain>
    </AppShell>
  );
}
