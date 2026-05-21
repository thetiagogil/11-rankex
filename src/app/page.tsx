import {
  ArrowUpRight,
  Clapperboard,
  Coffee,
  Gamepad2,
  GripVertical,
  LayoutGrid,
  ListOrdered,
  LockKeyhole,
  Music,
  type LucideIcon,
} from "lucide-react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";
import { Badge } from "@/shared/components/ui/badge";
import { ButtonLink } from "@/shared/components/ui/button-link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { getCurrentUser } from "@/shared/server/auth";

type FeatureCard = {
  description: string;
  icon: LucideIcon;
  title: string;
};

type TrendingList = {
  description: string;
  entries: number;
  icon: LucideIcon;
  title: string;
  topic: string;
};

const featureCards: FeatureCard[] = [
  {
    description: "Create lists for movies, albums, restaurants, books, games, or anything else worth ordering.",
    icon: ListOrdered,
    title: "Ranked lists",
  },
  {
    description: "Switch from exact order to S/A/B/C/D tiers when the comparison gets less precise.",
    icon: LayoutGrid,
    title: "Tier view",
  },
  {
    description: "Move entries quickly and keep the final order synced to your account.",
    icon: GripVertical,
    title: "Drag reorder",
  },
  {
    description: "Keep drafts private, then publish the lists you want other people to browse.",
    icon: LockKeyhole,
    title: "Visibility",
  },
];

const trendingLists: TrendingList[] = [
  {
    description: "Quiet classics, dense visuals, and the kind of films that reward a second watch.",
    entries: 4,
    icon: Clapperboard,
    title: "Comfort films worth revisiting",
    topic: "Movies",
  },
  {
    description: "Reliable counters, strong coffee, and places worth crossing town for.",
    entries: 3,
    icon: Coffee,
    title: "Lisbon coffee counters",
    topic: "Food",
  },
  {
    description: "Low-friction picks that work when everyone at the table has a different taste.",
    entries: 3,
    icon: Gamepad2,
    title: "Board games for mixed groups",
    topic: "Games",
  },
  {
    description: "No-skip records, focus playlists, and albums that still feel durable.",
    entries: 8,
    icon: Music,
    title: "Albums that hold up",
    topic: "Music",
  },
];

export default async function LandingPage() {
  const currentUser = await getCurrentUser();
  const isAuthenticated = Boolean(currentUser);

  if (isAuthenticated) {
    return (
      <ProtectedAppShell>
        <LandingContent isAuthenticated={isAuthenticated} />
      </ProtectedAppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader
        actions={
          <ButtonLink className="[box-shadow:none]" href="/auth" size="lg">
            Log in
          </ButtonLink>
        }
      />

      <LandingContent isAuthenticated={isAuthenticated} />
    </AppShell>
  );
}

function LandingContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const primaryHref = isAuthenticated ? "/dashboard" : "/auth?mode=signup";
  const secondaryHref = isAuthenticated ? "/explore" : "/auth";
  const primaryLabel = isAuthenticated ? "Go to dashboard" : "Get started";
  const secondaryLabel = isAuthenticated
    ? "Explore rankings"
    : "Test with demo account";

  return (
    <AppMain className="pb-20">
      <section className="pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl leading-[0.95] font-black text-balance sm:text-7xl">
            Rank{" "}
            <em className="text-gradient-gold not-italic">what matters</em>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Build top lists for anything worth ordering: films, albums,
            restaurants, games, books, places, and personal canon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primaryHref} size="lg">
              {primaryLabel}
            </ButtonLink>
            <ButtonLink href={secondaryHref} size="lg" variant="outline">
              {secondaryLabel}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold">
            A straightforward place for ranked lists
          </h2>
          <p className="mt-3 text-muted-foreground">
            Rankex keeps the first version focused: create lists, add items,
            reorder them, switch views, and decide what should be public.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Trending rankings
            </h2>
            <p className="mt-2 text-muted-foreground">
              A preview of public lists people can browse by topic.
            </p>
          </div>
          <ButtonLink
            href={isAuthenticated ? "/explore" : "/auth"}
            size="sm"
            variant="link"
          >
            Explore
            <ArrowUpRight data-icon="inline-end" />
          </ButtonLink>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trendingLists.map((list) => (
            <TrendingListCard key={list.title} list={list} />
          ))}
        </div>
      </section>
    </AppMain>
  );
}

function FeatureCard({ feature }: { feature: FeatureCard }) {
  const Icon = feature.icon;

  return (
    <Card as="article" className="bg-card/70" size="sm">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          <CardTitle className="text-base">{feature.title}</CardTitle>
        </div>
        <CardDescription className="leading-6">
          {feature.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function TrendingListCard({ list }: { list: TrendingList }) {
  const Icon = list.icon;

  return (
    <Card as="article" className="bg-card/70" interactive size="sm">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-primary">
            <Icon className="size-4" />
          </span>
          <Badge variant="surface">{list.topic}</Badge>
        </div>
        <div>
          <CardTitle className="line-clamp-2">{list.title}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2 leading-6">
            {list.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="justify-between gap-3 text-xs text-muted-foreground">
        <span>Public ranking</span>
        <span>{list.entries} entries</span>
      </CardFooter>
    </Card>
  );
}
