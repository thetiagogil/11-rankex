import {
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Coffee,
  Gamepad2,
  GripVertical,
  LayoutGrid,
  ListOrdered,
  LockKeyhole,
  Music,
  Sparkles,
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

const marqueeTopics = [
  "Films",
  "Games",
  "Albums",
  "Restaurants",
  "Books",
  "Cities",
  "Coffee",
  "Trails",
  "Directors",
  "Desserts",
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
      <section className="grid items-center gap-10 pt-14 sm:pt-18 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
        <div className="max-w-3xl">
          <span className="chip text-xs font-bold">
            <Sparkles className="size-3" />
            Ranked lists with personality
          </span>
          <h1 className="mt-5 font-display text-6xl leading-[0.9] font-black text-balance sm:text-8xl">
            Rank{" "}
            <em className="scribble text-gradient-gold not-italic">
              what matters
            </em>
            .
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Build top lists for anything worth ordering: films, albums,
            restaurants, games, books, places, and personal canon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primaryHref} size="lg">
              {primaryLabel}
              <ArrowRight data-icon="inline-end" />
            </ButtonLink>
            <ButtonLink href={secondaryHref} size="lg" variant="outline">
              {secondaryLabel}
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-md max-lg:mt-2">
          <SampleCard
            accent="oklch(0.78 0.17 55)"
            emoji="🎮"
            items={["Clair Obscur", "Silksong", "Hades II"]}
            left={18}
            rotate={-6}
            title="Game night canon"
            topic="Games"
            top={0}
          />
          <SampleCard
            accent="oklch(0.66 0.24 0)"
            emoji="🎬"
            items={["In the Mood for Love", "Spirited Away", "Paddington 2"]}
            left={128}
            rotate={4}
            title="Comfort films"
            topic="Movies"
            top={86}
          />
          <SampleCard
            accent="oklch(0.58 0.2 290)"
            emoji="🎧"
            items={["Brat", "Cowboy Carter", "Imaginal Disk"]}
            left={42}
            rotate={-3}
            title="Albums that hold up"
            topic="Music"
            top={176}
          />
        </div>
      </section>

      <section className="mt-16 overflow-hidden border-y-2 border-foreground bg-foreground py-4 text-background">
        <div className="marquee">
          {[0, 1].map((track) => (
            <div className="marquee-track" key={track}>
              {marqueeTopics.map((topic) => (
                <span
                  className="font-display text-3xl font-bold tracking-wider uppercase"
                  key={`${track}-${topic}`}
                >
                  {topic}
                  <span className="mx-6 text-primary">★</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-18">
        <div className="max-w-2xl">
          <h2 className="font-display text-5xl leading-none font-bold">
            Built for <span className="scribble">opinions</span>.
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

      <section className="mt-18">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-5xl leading-none font-bold">
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

      <section className="sticker relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-gold px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="absolute top-6 left-6 rotate-[-14deg] text-5xl opacity-25">
          🏆
        </div>
        <div className="absolute right-8 bottom-6 rotate-[16deg] text-5xl opacity-25">
          ★
        </div>
        <h2 className="relative font-display text-5xl leading-none font-bold text-primary-foreground sm:text-7xl">
          What belongs in your top 10?
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-primary-foreground/90">
          Start with one list, keep it private while drafting, then publish when
          the order feels right.
        </p>
        <div className="relative mt-7">
          <ButtonLink href={primaryHref} size="lg" variant="outline">
            Make your first list
            <ArrowRight data-icon="inline-end" />
          </ButtonLink>
        </div>
      </section>
    </AppMain>
  );
}

function FeatureCard({ feature }: { feature: FeatureCard }) {
  const Icon = feature.icon;

  return (
    <Card as="article" className="bg-card" interactive size="sm">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-gradient-gold text-primary-foreground shadow-[3px_3px_0_0_var(--shadow-ink)]">
            <Icon className="size-4" />
          </span>
          <CardTitle>{feature.title}</CardTitle>
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
    <Card as="article" className="bg-card" interactive size="sm">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-secondary text-primary shadow-[3px_3px_0_0_var(--shadow-ink)]">
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

function SampleCard({
  accent,
  emoji,
  items,
  left,
  rotate,
  title,
  topic,
  top,
}: {
  accent: string;
  emoji: string;
  items: string[];
  left: number;
  rotate: number;
  title: string;
  topic: string;
  top: number;
}) {
  return (
    <div
      className="sticker absolute w-64 rounded-3xl bg-card p-5"
      style={{ left, top, transform: `rotate(${rotate}deg)` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-3xl">{emoji}</div>
        <span
          className="rounded-full border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-black tracking-widest uppercase"
          style={{ background: accent }}
        >
          {topic}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-none font-bold">
        {title}
      </h3>
      <ol className="mt-3 flex flex-col gap-1.5 text-sm">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={item}>
            <span
              className="grid size-6 shrink-0 place-items-center rounded-lg border-2 border-foreground font-display text-sm leading-none"
              style={{ background: accent }}
            >
              {index + 1}
            </span>
            <span className="truncate text-foreground/75">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
