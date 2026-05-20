import { AtSign, Mail, UserRound } from "lucide-react";

import { getProfileInitials } from "@/shared/utils/profile";

type ProfileSummaryPanelProps = {
  bio: string;
  displayName: string;
  email: string | null;
  username: string;
};

export function ProfileSummaryPanel({
  bio,
  displayName,
  email,
  username,
}: ProfileSummaryPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card/75 shadow-elevated">
      <div className="h-2 bg-gradient-gold" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-gold font-display text-2xl font-black text-primary-foreground shadow-glow">
            {getProfileInitials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              Live curator card
            </p>
            <p className="mt-1 truncate font-display text-2xl font-bold">
              {displayName}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 truncate">
            <AtSign className="size-4 text-primary" />
            {username || "No username set"}
          </p>
          <p className="flex items-center gap-2 truncate">
            <Mail className="size-4 text-primary" />
            {email ?? "No email available"}
          </p>
          <p className="flex items-start gap-2 leading-6">
            <UserRound className="mt-1 size-4 shrink-0 text-primary" />
            <span className="line-clamp-3">
              {bio ? (
                bio.trim()
              ) : (
                <span className="text-muted-foreground/50 italic">
                  Add a short bio for your ranking profile.
                </span>
              )}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
