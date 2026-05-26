import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { core, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { mapProfile } from "@/shared/server/mappers";
import type { CurrentUser, Profile, ProfileRow } from "@/shared/types";

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required.");
    this.name = "AuthRequiredError";
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const client = await createClient();
  const user = await getCurrentAuthUser(client);

  if (!user) return null;

  const profile = await ensureProfileForAuthUser(client, user);

  return {
    id: user.id,
    email: user.email ?? null,
    profile: mapProfile(profile),
  };
}

export async function requireUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  return currentUser;
}

export async function requireAuthUser(client: AppSupabaseClient) {
  const user = await getCurrentAuthUser(client);

  if (!user) {
    throw new AuthRequiredError();
  }

  return user;
}

export async function getCurrentAuthUser(client: AppSupabaseClient) {
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}

export async function ensureProfileForAuthUser(
  client: AppSupabaseClient,
  user: User,
): Promise<ProfileRow> {
  const existing = await readProfile(client, user.id);

  if (existing) {
    return existing;
  }

  const defaults = getProfileDefaults(user);
  const { data, error } = await core(client)
    .from("profiles")
    .insert({
      id: user.id,
      display_name: defaults.displayName,
      avatar_url: defaults.avatarUrl,
    })
    .select(
      "id, display_name, avatar_url, username, bio, created_at, updated_at",
    )
    .single();

  if (!error && data) {
    return data;
  }

  if (error?.code === "23505") {
    const racedProfile = await readProfile(client, user.id);

    if (racedProfile) {
      return racedProfile;
    }
  }

  throw new Error(error?.message ?? "Could not create profile.");
}

export function hasProfile(profile: Profile | null): profile is Profile {
  return Boolean(profile);
}

async function readProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await core(client)
    .from("profiles")
    .select(
      "id, display_name, avatar_url, username, bio, created_at, updated_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function getProfileDefaults(user: User) {
  const metadata = isRecord(user.user_metadata) ? user.user_metadata : {};
  const emailName = user.email?.split("@")[0]?.replace(/[._-]+/g, " ");
  const displayName =
    readString(metadata.display_name) ??
    readString(metadata.full_name) ??
    readString(metadata.name) ??
    titleCase(emailName) ??
    "Rankex profile";

  return {
    displayName,
    avatarUrl: readString(metadata.avatar_url) ?? readString(metadata.picture),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function titleCase(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
