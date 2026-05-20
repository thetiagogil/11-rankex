import {
  Compass,
  GripVertical,
  LayoutGrid,
  ListOrdered,
  Sparkles,
} from "lucide-react";
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
    description: "Move entries quickly and preserve the final order in Supabase.",
  },
  {
    icon: Compass,
    title: "Explore feed",
    description: "Browse public rankings by topic without social-feed complexity.",
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
            <ButtonLink href="/auth" variant="ghost">
              Log in
            </ButtonLink>
            <ButtonLink href="/auth?mode=signup">Get started</ButtonLink>
          </>
        }
      />

      <AppMain className="pb-20">
        <section className="mt-20 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase">
            <Sparkles className="size-3" />
            Ranked-list workspace
          </span>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] font-black text-balance sm:text-7xl">
            Rank <em className="text-gradient-gold not-italic">what matters</em>.
            <br />
            Share what holds up.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Build top lists for anything worth ordering: films, albums,
            restaurants, games, books, places, and personal canon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/auth?mode=signup" size="lg">
              Start ranking
            </ButtonLink>
            <ButtonLink href="/auth" size="lg" variant="outline">
              Use demo account
            </ButtonLink>
          </div>
        </section>

        <section className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => (
            <Card as="article" className="bg-card/60 p-6" key={feature.title}>
              <feature.icon className="size-6 text-primary" />
              <h2 className="mt-4 font-display text-lg font-bold">
                {feature.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </section>
      </AppMain>
    </AppShell>
  );
}
