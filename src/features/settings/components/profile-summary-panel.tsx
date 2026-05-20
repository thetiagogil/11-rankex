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
    <section className="border-border bg-card flex items-center gap-5 rounded-xl border p-5 sm:p-6">
      <div className="bg-gradient-stage text-primary-foreground font-display shadow-stage grid h-20 w-20 shrink-0 place-items-center rounded-full text-2xl font-bold">
        {getProfileInitials(displayName)}
      </div>
      <div className="min-w-0">
        <p className="mb-1 flex items-center gap-2 font-semibold">
          <User className="text-primary h-4 w-4" />
          {displayName}
        </p>
        <p className="text-muted-foreground flex items-center gap-2 truncate text-sm">
          <Mail className="text-primary h-4 w-4" />
          {email ?? "No email available"}
        </p>
        <p className="text-secondary mt-1 font-mono text-xs">
          {username ? `@${username}` : "No username set"}
        </p>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6">
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
