import { Settings, Trophy } from "lucide-react";

import { ListCard } from "@/features/lists/components/list-card";
import type { ProfileOverview } from "@/features/profile/types";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { Card } from "@/shared/components/ui/card";
import { getProfileInitials } from "@/shared/utils/profile";

type ProfilePageViewProps = {
  isCurrentUser?: boolean;
  overview: ProfileOverview;
};

export function ProfilePageView({
  isCurrentUser = false,
  overview,
}: ProfilePageViewProps) {
  const { lists, profile, stats } = overview;
  const emptyCopy = isCurrentUser
    ? "Create a list from the dashboard to start building out your public profile."
    : "This curator has not published a list yet.";

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-border bg-card/45 p-5 shadow-elevated sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="grid size-32 shrink-0 place-items-center rounded-2xl bg-gradient-gold font-display text-4xl font-black text-primary-foreground shadow-glow sm:size-36">
            {getProfileInitials(profile.displayName)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate font-display text-3xl leading-tight font-black sm:text-4xl">
                  {profile.displayName}
                </h1>
                <p className="mt-1 truncate font-mono text-sm text-primary">
                  {profile.username
                    ? `@${profile.username}`
                    : "Rankex profile"}
                </p>
              </div>

              {isCurrentUser ? (
                <ButtonLink
                  className="shrink-0 self-start"
                  href="/settings"
                  variant="outline"
                >
                  <Settings data-icon="inline-start" />
                  Edit profile
                </ButtonLink>
              ) : null}
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {profile.bio ||
                "A Rankex curator building ordered lists, tiers, and personal canon."}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>
                <strong className="font-display text-lg text-foreground">
                  {stats.listCount}
                </strong>{" "}
                {isCurrentUser ? "lists" : "public lists"}
              </span>
              <span>
                <strong className="font-display text-lg text-foreground">
                  {stats.itemCount}
                </strong>{" "}
                ranked items
              </span>
              <span>
                <strong className="font-display text-lg text-foreground">
                  {stats.topics.length}
                </strong>{" "}
                topics
              </span>
            </div>
          </div>
        </div>
      </section>

      {stats.topics.length ? (
        <section className="flex flex-wrap gap-2">
          {stats.topics.map((topic) => (
            <span
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase"
              key={topic}
            >
              {topic}
            </span>
          ))}
        </section>
      ) : null}

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold">Ranked lists</h2>
        </div>

        {lists.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} showOwner={!isCurrentUser} />
            ))}
          </div>
        ) : (
          <Card
            as="section"
            className="border-dashed bg-card/35 px-6 py-16 text-center"
          >
            <Trophy className="mx-auto size-9 text-muted-foreground" />
            <p className="mt-4 font-display text-xl">No rankings here yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {emptyCopy}
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
