export type ProfileSettingsInput = {
  bio?: string | null;
  displayName: string;
  username?: string | null;
};

export type NormalizedProfileSettingsInput = {
  bio: string | null;
  displayName: string;
  username: string | null;
};

const displayNameMaxLength = 80;
const bioMaxLength = 160;
const usernameMaxLength = 30;
const usernameMinLength = 3;
const usernamePattern = /^[a-z0-9_]+$/;

export function normalizeProfileSettingsInput(
  input: ProfileSettingsInput,
):
  | { ok: true; data: NormalizedProfileSettingsInput }
  | { ok: false; error: string } {
  const displayName = input.displayName.trim();
  const bio = input.bio?.trim() || null;
  const username = input.username?.trim().toLowerCase() || null;

  if (!displayName) {
    return { ok: false, error: "Display name is required." };
  }

  if (displayName.length > displayNameMaxLength) {
    return {
      ok: false,
      error: `Display name must be ${displayNameMaxLength} characters or fewer.`,
    };
  }

  if (bio && bio.length > bioMaxLength) {
    return {
      ok: false,
      error: `Bio must be ${bioMaxLength} characters or fewer.`,
    };
  }

  if (username) {
    if (
      username.length < usernameMinLength ||
      username.length > usernameMaxLength
    ) {
      return {
        ok: false,
        error: `Username must be ${usernameMinLength}-${usernameMaxLength} characters.`,
      };
    }

    if (!usernamePattern.test(username)) {
      return {
        ok: false,
        error: "Username can only use lowercase letters, numbers, and underscores.",
      };
    }
  }

  return { ok: true, data: { bio, displayName, username } };
}
