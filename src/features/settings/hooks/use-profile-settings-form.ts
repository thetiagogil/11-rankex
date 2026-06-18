"use client";

import { type ComponentProps, useState, useTransition } from "react";

import { updateProfileSettingsAction } from "@/features/settings/server/actions";
import type { CurrentUser } from "@/shared/types";

type ProfileSettingsFeedback = {
  message: string;
  tone: "error" | "success";
};

export const useProfileSettingsForm = (currentUser: CurrentUser) => {
  const initialDisplayName = currentUser.profile.displayName;
  const initialBio = currentUser.profile.bio ?? "";
  const initialUsername = currentUser.profile.username ?? "";
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [username, setUsername] = useState(initialUsername);
  const [feedback, setFeedback] = useState<ProfileSettingsFeedback | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const submit: NonNullable<ComponentProps<"form">["onSubmit"]> = (event) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await updateProfileSettingsAction({
        bio,
        displayName,
        username,
      });

      if (!result.ok) {
        setFeedback({ message: result.error, tone: "error" });
        return;
      }

      setDisplayName(result.data.displayName);
      setBio(result.data.bio ?? "");
      setUsername(result.data.username ?? "");
      setFeedback({ message: "Profile settings saved.", tone: "success" });
    });
  };

  const reset = () => {
    setDisplayName(initialDisplayName);
    setBio(initialBio);
    setUsername(initialUsername);
    setFeedback(null);
  };

  return {
    bio,
    displayName,
    feedback,
    isPending,
    reset,
    setBio,
    setDisplayName,
    setUsername,
    submit,
    username,
  };
};
