import { Edit3, ListChecks, Settings, Sparkles, Trophy } from "lucide-react";
import type { ReactNode } from "react";

import { ListCard } from "@/features/lists/components/list-card";
import type { ProfileOverview } from "@/features/profile/types";
import { PageHeader } from "@/shared/components/layout/page-header";
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
      <PageHeader
        actions={
          isCurrentUser ? (
            <ButtonLink href="/settings" variant="outline">
              <Settings data-icon="inline-start" />
              Edit profile
            </ButtonLink>
          ) : null
        }
        description={
          profile.bio ||
          "A Rankex curator building ordered lists, tiers, and personal canon."
        }
        eyebrow={profile.username ? `@${profile.username}` : "Rankex profile"}
        icon={
          <span className="font-display text-xl font-black">
            {getProfileInitials(profile.displayName)}
          </span>
        }
        meta={
          <>
            <ProfileMetric
              icon={<ListChecks />}
              label={isCurrentUser ? "Lists" : "Public lists"}
              value={stats.listCount}
            />
            <ProfileMetric
              icon={<Sparkles />}
              label="Ranked items"
              value={stats.itemCount}
            />
            <ProfileMetric
              icon={<Trophy />}
              label="Topics"
              value={stats.topics.length}
            />
          </>
        }
        title={profile.displayName}
      />

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
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              Published canon
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Ranked lists
            </h2>
          </div>
          {isCurrentUser ? (
            <ButtonLink href="/dashboard" variant="ghost">
              <Edit3 data-icon="inline-start" />
              Manage lists
            </ButtonLink>
          ) : null}
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

function ProfileMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/65 px-3 py-2 text-sm text-muted-foreground">
      <span className="[&_svg]:size-4 [&_svg]:text-primary">{icon}</span>
      <span className="font-display text-lg font-bold text-foreground">
        {value}
      </span>
      {label}
    </span>
  );
}
