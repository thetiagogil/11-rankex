import type { Profile, ProfileRow } from "@/shared/types";

export const mapProfile = (row: ProfileRow): Profile => {
  return {
    id: row.id,
    displayName: row.display_name ?? row.username ?? "Rankex profile",
    username: row.username,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
