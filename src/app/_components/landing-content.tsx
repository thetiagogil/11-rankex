import { ArrowRight, Star, Trophy } from "lucide-react";

import { LandingFeatureCard } from "@/app/_components/landing-feature-card";
import { SampleRankingDeck } from "@/app/_components/sample-ranking-deck";
import { landingFeatureCards, marqueeTopicLoop } from "@/content/landing";
import { ButtonLink } from "@/shared/components/button-link";
import { AppMain } from "@/shared/components/layout/app-main";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

type LandingContentProps = {
  isAuthenticated: boolean;
};

export const LandingContent = ({ isAuthenticated }: LandingContentProps) => {
  const primaryHref = isAuthenticated ? "/dashboard" : "/signup";
  const secondaryHref = isAuthenticated ? "/explore" : "/login";
  const primaryLabel = isAuthenticated ? "Go to dashboard" : "Get started";

  return (
    <AppMain className="pb-20">
      <section className="relative grid items-center gap-10 pt-12 sm:pt-18 lg:grid-cols-[1.25fr_1fr] lg:pt-22">
        <div className="max-w-3xl">
          <h1 className="font-display text-6xl leading-[0.92] font-black text-balance sm:text-7xl lg:text-8xl">
            Rank <span className="text-gradient-gold">what matters</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
            Build top lists for anything worth ordering. Follow people, like,
            comment, and remix the community&apos;s picks into your own canon.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={primaryHref} size="lg">
              {primaryLabel}
              <ArrowRight data-icon="inline-end" />
            </ButtonLink>
            {isAuthenticated ? (
              <ButtonLink href={secondaryHref} size="lg" variant="outline">
                Explore rankings
              </ButtonLink>
            ) : (
              <form
                action="/api/auth/demo"
                className="w-full sm:w-auto"
                method="post"
              >
                <input name="next" type="hidden" value="/dashboard" />
                <Button
                  className="w-full sm:w-auto"
                  size="lg"
                  type="submit"
                  variant="outline"
                >
                  Test with demo account
                </Button>
              </form>
            )}
          </div>
        </div>

        <SampleRankingDeck />
      </section>

      <section className="border-foreground/25 bg-foreground text-background mt-14 overflow-hidden border-y py-3 sm:mt-16 sm:py-4">
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

      <section className="mt-16 sm:mt-18">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display max-w-xl text-4xl leading-none font-black sm:text-5xl">
            Built for <span className="text-gradient-gold">opinions</span>
          </h2>
          <p className="text-muted-foreground max-w-xs text-sm leading-6">
            Drag, drop, rank, remix. Then put it in front of people who care.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {landingFeatureCards.map((feature) => (
            <LandingFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <Card
        as="section"
        className="bg-gradient-gold relative mt-18 overflow-hidden rounded-3xl px-6 py-10 text-center sm:mt-20 sm:px-12 sm:py-16"
        color="navy"
      >
        <Trophy className="text-primary-foreground/30 absolute top-6 left-6 size-12 rotate-[-14deg]" />
        <Star className="text-primary-foreground/30 absolute right-8 bottom-6 size-12 rotate-16" />
        <h2 className="font-display text-primary-foreground relative text-5xl leading-none font-bold sm:text-7xl">
          What&apos;s on your top 10?
        </h2>
        <p className="text-primary-foreground/90 relative mx-auto mt-3 max-w-md">
          Make your own lists, follow your friends, and discover new favorites.
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
};
