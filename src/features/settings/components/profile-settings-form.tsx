"use client";

import {
  AtSign,
  Loader2,
  Mail,
  MessageSquareText,
  RotateCcw,
  Save,
  UserRound,
} from "lucide-react";
import { type SubmitEvent, useState, useTransition } from "react";

import { SettingsSection } from "@/features/settings/components/settings-section";
import { updateProfileSettingsAction } from "@/features/settings/server/actions";
import { FormActions } from "@/shared/components/form-actions";
import { FormField } from "@/shared/components/form-field";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import type { CurrentUser } from "@/shared/types";

type ProfileSettingsFormProps = {
  currentUser: CurrentUser;
};

export function ProfileSettingsForm({ currentUser }: ProfileSettingsFormProps) {
  const initialDisplayName = currentUser.profile.displayName;
  const initialBio = currentUser.profile.bio ?? "";
  const initialUsername = currentUser.profile.username ?? "";
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [username, setUsername] = useState(initialUsername);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
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

  return (
    <form className="w-full" onSubmit={submit}>
      <Card as="section" className="p-5 sm:p-7">
        <div className="flex flex-col gap-7">
          <SettingsSection
            description="Used only for logging in and account recovery. It is not shown on public Rankex pages."
            title="Account anchor"
          >
            <FormField htmlFor="email" icon={<Mail />} label="Email">
              <Input disabled id="email" value={currentUser.email ?? ""} />
            </FormField>
          </SettingsSection>

          <SettingsSection
            description="The name and handle people see before they open one of your rankings."
            title="Public profile"
          >
            <div className="grid gap-4">
              <FormField
                htmlFor="displayName"
                icon={<UserRound />}
                label="Display name"
                required
              >
                <Input
                  autoComplete="name"
                  disabled={isPending}
                  id="displayName"
                  maxLength={80}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  value={displayName}
                />
              </FormField>

              <FormField
                description="Lowercase letters, numbers, and underscores. Leave blank to keep the generated profile URL."
                htmlFor="username"
                icon={<AtSign />}
                label="Username"
              >
                <Input
                  autoComplete="username"
                  disabled={isPending}
                  id="username"
                  maxLength={30}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="rank_profile"
                  value={username}
                />
              </FormField>
            </div>
          </SettingsSection>

          <SettingsSection
            description="A short line that gives your rankings a recognizable point of view."
            title="Ranking voice"
          >
            <FormField htmlFor="bio" icon={<MessageSquareText />} label="Bio">
              <Textarea
                disabled={isPending}
                id="bio"
                maxLength={160}
                onChange={(event) => setBio(event.target.value)}
                placeholder="A short note about what you like to rank."
                rows={5}
                value={bio}
              />
              <p className="text-muted-foreground text-right font-mono text-[10px]">
                {bio.length}/160
              </p>
            </FormField>
          </SettingsSection>

          {feedback ? (
            <Alert tone={feedback.tone}>{feedback.message}</Alert>
          ) : null}

          <FormActions>
            <Button
              disabled={isPending}
              onClick={reset}
              type="button"
              variant="ghost"
            >
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Save data-icon="inline-start" />
              )}
              Save profile
            </Button>
          </FormActions>
        </div>
      </Card>
    </form>
  );
}
