import { ListChecks, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";

import type { ProfileListStats } from "@/features/profile/types";
import { Card } from "@/shared/components/ui/card";
import type { Profile } from "@/shared/types";
import { getProfileHref, getProfileInitials } from "@/shared/utils/profile";

type ProfileCardProps = {
  profile: Profile;
  stats: ProfileListStats;
};

export function ProfileCard({ profile, stats }: ProfileCardProps) {
  return (
    <Card
      as="article"
      className="group bg-card/65 p-4 transition hover:border-primary/45"
      interactive
    >
      <Link className="block" href={getProfileHref(profile)}>
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-gold font-display text-base font-black text-primary-foreground shadow-glow">
            {getProfileInitials(profile.displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-bold">
              {profile.displayName}
            </p>
            <p className="truncate font-mono text-xs text-primary">
              {profile.username ? `@${profile.username}` : "Rankex curator"}
            </p>
          </div>
          <UserRound className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
        </div>

        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {profile.bio || "Collecting rankings, tiers, and lists worth revisiting."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/45 px-2 py-1 font-mono text-muted-foreground">
            <ListChecks className="size-3.5" />
            {stats.publicListCount} public
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/45 px-2 py-1 font-mono text-muted-foreground">
            <Sparkles className="size-3.5" />
            {stats.itemCount} ranked
          </span>
        </div>
      </Link>
    </Card>
  );
}
