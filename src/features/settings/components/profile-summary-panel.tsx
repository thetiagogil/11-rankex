import { Mail, User } from "lucide-react";

import { getProfileInitials } from "@/features/settings/lib/profile-formatting";

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
    <section className="flex items-center gap-5 rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
      <div className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-gold font-display text-2xl font-bold text-primary-foreground shadow-glow">
        {getProfileInitials(displayName)}
      </div>
      <div className="min-w-0">
        <p className="mb-1 flex items-center gap-2 font-semibold">
          <User className="size-4 text-primary" />
          {displayName}
        </p>
        <p className="flex items-center gap-2 truncate text-sm text-muted-foreground">
          <Mail className="size-4 text-primary" />
          {email ?? "No email available"}
        </p>
        <p className="mt-1 font-mono text-xs text-primary">
          {username ? `@${username}` : "No username set"}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {bio ? (
            bio.trim()
          ) : (
            <span className="text-muted-foreground/40 italic">
              Add a short bio for your ranking profile.
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
