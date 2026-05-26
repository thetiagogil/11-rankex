import {
  ArrowRight,
  Clapperboard,
  Compass,
  Gamepad2,
  Heart,
  List,
  Music,
  Star,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ButtonLink } from "@/shared/components/button-link";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";
import { Card } from "@/shared/components/ui/card";
import { getCurrentUser } from "@/shared/server/auth";
import { cn } from "@/shared/utils/cn";

type FeatureCard = {
  accent: string;
  description: string;
  icon: LucideIcon;
  tilt: string;
  title: string;
};

type SampleRanking = {
  accent: string;
  icon: LucideIcon;
  items: string[];
  title: string;
  topic: string;
};

type SampleDeckLayout = {
  left: number;
  rotate: number;
  top: number;
};

const featureCards: FeatureCard[] = [
  {
    accent: "oklch(0.78 0.1 50)",
    description: "Drag-and-drop ordering with scores, notes, and tiers.",
    icon: List,
    tilt: "tilt-l",
    title: "Ranked lists",
  },
  {
    accent: "oklch(0.68 0.09 245)",
    description: "Trending lists by topic, surfaced from the community.",
    icon: Compass,
    tilt: "tilt-r",
    title: "Explore feed",
  },
  {
    accent: "oklch(0.78 0.06 320)",
    description: "Build a feed of taste you trust. Profiles for every user.",
    icon: Users,
    tilt: "tilt-l",
    title: "Follow curators",
  },
  {
    accent: "oklch(0.78 0.07 150)",
    description: "React to others, fork their lists, and make them yours.",
    icon: Heart,
    tilt: "tilt-r",
    title: "Like, remix, comment",
  },
];

const sampleRankings: SampleRanking[] = [
  {
    accent: "oklch(0.78 0.1 50)",
    icon: Clapperboard,
    items: ["Attack on Titan", "Demon Slayer", "My Hero Academia"],
    title: "GOTY 2025",
    topic: "Games",
  },
  {
    accent: "oklch(0.78 0.06 320)",
    icon: Music,
    items: ["Blackbear", "Sueco", "Creepy Nuts"],
    title: "Best artists",
    topic: "Artists",
  },
  {
    accent: "oklch(0.68 0.09 245)",
    icon: Gamepad2,
    items: ["Assassins Creed", "Pokémon", "Grand Theft Auto"],
    title: "Best game franchises",
    topic: "Games",
  },
];

const sampleDeckLayout: SampleDeckLayout[] = [
  { left: 20, rotate: -7, top: 0 },
  { left: 124, rotate: 4, top: 78 },
  { left: 42, rotate: -3, top: 172 },
];

const defaultSampleDeckLayout: SampleDeckLayout = sampleDeckLayout[0] ?? {
  left: 20,
  rotate: -7,
  top: 0,
};

const marqueeTopics = [
  "Films",
  "Games",
  "Albums",
  "Restaurants",
  "Books",
  "Cities",
  "TV shows",
  "Podcasts",
  "Comics",
  "Anime",
  "Hobbies",
  "Cars",
  "Recipes",
  "Songs",
  "Artists",
  "Memes",
  "Destinations",
  "Sports teams",
  "Cryptocurrencies",
  "Board games",
  "Fitness routines",
  "Superheroes",
  "Villains",
  "TV characters",
];

const marqueeTopicCopies = 12;
const marqueeTopicLoop = Array.from(
  { length: marqueeTopicCopies },
  (_, copyIndex) =>
    marqueeTopics.map((topic, topicIndex) => ({
      copyIndex,
      topic,
      topicIndex,
    })),
).flat();

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
          <ButtonLink className="[box-shadow:none]" href="/login" size="lg">
            Log in
          </ButtonLink>
        }
      />

      <LandingContent isAuthenticated={isAuthenticated} />
    </AppShell>
  );
}

function LandingContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const primaryHref = isAuthenticated ? "/dashboard" : "/signup";
  const secondaryHref = isAuthenticated ? "/explore" : "/login";
  const primaryLabel = isAuthenticated ? "Go to dashboard" : "Get started";
  const secondaryLabel = isAuthenticated
    ? "Explore rankings"
    : "Test with demo account";

  return (
    <AppMain className="pb-20">
      <section className="relative grid items-center gap-10 pt-14 sm:pt-20 lg:grid-cols-[1.3fr_1fr] lg:pt-24">
        <div className="max-w-3xl">
          <h1 className="font-display mt-5 text-6xl leading-[0.92] font-black text-balance sm:text-7xl lg:text-8xl">
            Rank <span className="text-gradient-gold">what matters</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
            Build top lists for anything worth ordering. Follow tastemakers,
            like, comment, and remix the community&apos;s picks into your own
            canon.
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

        <SampleRankingDeck />
      </section>

      <section className="border-foreground/35 bg-foreground text-background mt-16 overflow-hidden border-y py-4">
        <div className="marquee">
          <div className="marquee-track">
            {marqueeTopicLoop.map(({ copyIndex, topic, topicIndex }) => (
              <span
                aria-hidden={copyIndex > 0 ? "true" : undefined}
                className="font-display inline-flex shrink-0 items-center text-2xl font-bold tracking-normal uppercase sm:text-3xl"
                key={`${copyIndex}-${topicIndex}-${topic}`}
              >
                {topic}
                <span className="inline-flex w-16 shrink-0 items-center justify-center">
                  <Star
                    aria-hidden="true"
                    className="text-primary block size-5 fill-current"
                    strokeWidth={2.5}
                  />
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-18">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display max-w-xl text-4xl leading-none font-black sm:text-5xl">
            Built for <span className="text-gradient-gold">opinions</span>
          </h2>
          <p className="text-muted-foreground hidden max-w-xs text-sm leading-6 sm:block">
            Drag, drop, rank, remix. Then put it in front of people who care.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <Card
        as="section"
        className="bg-gradient-gold relative mt-20 overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16"
        color="navy"
      >
        <Trophy className="text-primary-foreground/30 absolute top-6 left-6 size-12 rotate-[-14deg]" />
        <Star className="text-primary-foreground/30 absolute right-8 bottom-6 size-12 rotate-16" />
        <h2 className="font-display text-primary-foreground relative text-5xl leading-none font-bold sm:text-7xl">
          What&apos;s on your top 10?
        </h2>
        <p className="text-primary-foreground/90 relative mx-auto mt-3 max-w-md">
          Five minutes to your first list. No credit card. No nonsense.
        </p>
        <div className="relative mt-7">
          <ButtonLink href={primaryHref} size="lg" variant="outline">
            Make your first list
            <ArrowRight data-icon="inline-end" />
          </ButtonLink>
        </div>
      </Card>
    </AppMain>
  );
}

function FeatureCard({ feature }: { feature: FeatureCard }) {
  const Icon = feature.icon;

  return (
    <Card
      as="article"
      className={cn("rounded-3xl p-6", feature.tilt)}
      variant="settle"
    >
      <div className="flex items-center gap-3">
        <span
          className="text-foreground grid size-12 shrink-0 place-items-center rounded-2xl"
          style={{ background: feature.accent }}
        >
          <Icon className="size-6" strokeWidth={2.5} />
        </span>
        <h3 className="font-display text-2xl leading-tight font-bold">
          {feature.title}
        </h3>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {feature.description}
      </p>
    </Card>
  );
}

function SampleRankingDeck() {
  return (
    <div className="relative mx-auto h-90 w-full max-w-md overflow-visible sm:h-97.5 lg:mt-0">
      <div className="absolute top-0 left-1/2 h-97.5 w-105 -translate-x-1/2 scale-[0.86] sm:scale-95 lg:scale-100">
        {sampleRankings.map((ranking, index) => (
          <SampleRankingCard
            key={ranking.title}
            layout={sampleDeckLayout[index] ?? defaultSampleDeckLayout}
            ranking={ranking}
          />
        ))}
      </div>
    </div>
  );
}

function SampleRankingCard({
  layout,
  ranking,
}: {
  layout: SampleDeckLayout;
  ranking: SampleRanking;
}) {
  const Icon = ranking.icon;

  return (
    <Card
      as="article"
      className="absolute w-64 rounded-3xl p-5"
      style={{
        left: layout.left,
        top: layout.top,
        transform: `rotate(${layout.rotate}deg)`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-foreground grid size-11 shrink-0 place-items-center rounded-2xl"
          style={{ background: ranking.accent }}
        >
          <Icon className="size-5" strokeWidth={2.5} />
        </span>
        <span
          className="text-foreground rounded-lg px-2 py-0.5 text-[10px] font-black tracking-widest uppercase"
          style={{ background: ranking.accent }}
        >
          {ranking.topic}
        </span>
      </div>
      <h3 className="font-display mt-3 text-xl leading-tight font-bold">
        {ranking.title}
      </h3>
      <ol className="mt-3 space-y-1.5 text-sm">
        {ranking.items.map((item, index) => (
          <li className="flex items-center gap-2" key={item}>
            <span
              className="font-display flex size-5 shrink-0 items-center justify-center rounded-md text-xs font-black"
              style={{ background: ranking.accent }}
            >
              {index + 1}
            </span>
            <span className="text-foreground/80 min-w-0 truncate">{item}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
