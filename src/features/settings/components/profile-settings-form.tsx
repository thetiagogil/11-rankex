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

import { SettingsSection } from "@/features/settings/components/settings-section";
import { useProfileSettingsForm } from "@/features/settings/hooks/use-profile-settings-form";
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
  const form = useProfileSettingsForm(currentUser);

  return (
    <form className="w-full" onSubmit={form.submit}>
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
                  disabled={form.isPending}
                  id="displayName"
                  maxLength={80}
                  onChange={(event) => form.setDisplayName(event.target.value)}
                  required
                  value={form.displayName}
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
                  disabled={form.isPending}
                  id="username"
                  maxLength={30}
                  onChange={(event) => form.setUsername(event.target.value)}
                  placeholder="rank_profile"
                  value={form.username}
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
                disabled={form.isPending}
                id="bio"
                maxLength={160}
                onChange={(event) => form.setBio(event.target.value)}
                placeholder="A short note about what you like to rank."
                rows={5}
                value={form.bio}
              />
              <p className="text-muted-foreground text-right font-mono text-[10px]">
                {form.bio.length}/160
              </p>
            </FormField>
          </SettingsSection>

          {form.feedback ? (
            <Alert tone={form.feedback.tone}>{form.feedback.message}</Alert>
          ) : null}

          <FormActions>
            <Button
              disabled={form.isPending}
              onClick={form.reset}
              type="button"
              variant="ghost"
            >
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
            <Button disabled={form.isPending} type="submit">
              {form.isPending ? (
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
