import type { Profile } from "@/shared/types";

export const getProfileInitials = (displayName: string) => {
  const initials = displayName
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials || "?";
};

export const getProfileHandle = (profile: Pick<Profile, "id" | "username">) => {
  return profile.username ?? profile.id;
};

export const getProfileHref = (profile: Pick<Profile, "id" | "username">) => {
  return `/u/${encodeURIComponent(getProfileHandle(profile))}`;
};

export const getProfileUsernameLabel = (profile: Pick<Profile, "username">) => {
  return profile.username ? `@${profile.username}` : null;
};
