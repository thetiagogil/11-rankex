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
  const bio =
    profile.bio ||
    "A Rankex curator building ordered lists, tiers, and personal canon.";

  return (
    <div className="flex flex-col gap-10">
      <Card as="section" className="bg-card/45 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex items-start justify-between gap-4 sm:block">
            <div className="grid size-28 shrink-0 place-items-center rounded-2xl bg-gradient-gold font-display text-4xl font-black text-primary-foreground shadow-glow sm:size-36">
              {getProfileInitials(profile.displayName)}
            </div>

            {isCurrentUser ? (
              <ButtonLink
                className="shrink-0 sm:hidden"
                href="/settings"
                size="sm"
                variant="outline"
              >
                <Settings data-icon="inline-start" />
                Edit profile
              </ButtonLink>
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-display text-3xl leading-tight font-black sm:text-4xl">
                  {profile.displayName}
                </h1>
                <p className="mt-1 truncate font-mono text-sm text-primary">
                  {profile.username ? `@${profile.username}` : "Rankex profile"}
                </p>
              </div>

              {isCurrentUser ? (
                <ButtonLink
                  className="max-sm:hidden shrink-0"
                  href="/settings"
                  variant="outline"
                >
                  <Settings data-icon="inline-start" />
                  Edit profile
                </ButtonLink>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-border py-4 sm:hidden">
              <ProfileStat
                label={isCurrentUser ? "Lists" : "Public lists"}
                value={stats.listCount}
              />
              <ProfileStat label="Ranked" value={stats.itemCount} />
              <ProfileStat label="Topics" value={stats.topics.length} />
            </div>

            <div className="mt-5 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground sm:flex">
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

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {bio}
            </p>
          </div>
        </div>
      </Card>

      {stats.topics.length ? (
        <section className="flex flex-wrap gap-2">
          {stats.topics.map((topic) => (
            <span
              className="border-primary/25 bg-primary/10 text-primary rounded-full border px-3 py-1 font-mono text-xs tracking-widest uppercase"
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
            className="bg-card/35 border-dashed px-6 py-16 text-center"
          >
            <Trophy className="text-muted-foreground mx-auto size-9" />
            <p className="font-display mt-4 text-xl">No rankings here yet</p>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
              {emptyCopy}
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <p className="font-display text-xl leading-none font-bold text-foreground">
        {value}
      </p>
      <p className="mt-1 truncate font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}
