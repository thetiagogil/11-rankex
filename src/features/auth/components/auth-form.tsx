"use client";

import {
  ArrowLeft,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";

import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Button } from "@/shared/components/ui/button";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { createClient } from "@/lib/supabase/browser";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  initialMode?: AuthMode;
  initialError?: string | null;
  next?: string;
};

const minimumPasswordLength = 8;

export function AuthForm({
  initialError,
  initialMode = "signin",
  next = "/dashboard",
}: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, setPending] = useState(false);

  const isSignup = mode === "signup";
  const emailValue = email.trim().toLowerCase();
  const continuePath = useMemo(
    () => `/auth/continue?next=${encodeURIComponent(next)}`,
    [next],
  );

  const switchMode = (value: AuthMode) => {
    setMode(value);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  };

  const validate = () => {
    if (!emailValue) return "Email is required.";
    if (password.length < minimumPasswordLength) {
      return `Password must be at least ${minimumPasswordLength} characters.`;
    }
    if (isSignup && password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const result = isSignup
        ? await supabase.auth.signUp({
            email: emailValue,
            password,
            options: {
              data: displayName.trim()
                ? { display_name: displayName.trim() }
                : undefined,
              emailRedirectTo:
                typeof window !== "undefined"
                  ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                      continuePath,
                    )}`
                  : undefined,
            },
          })
        : await supabase.auth.signInWithPassword({
            email: emailValue,
            password,
          });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (isSignup && !result.data.session) {
        setMessage(
          `Check ${emailValue} to confirm your account, then log in.`,
        );
        return;
      }

      router.replace(continuePath);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Supabase is not configured.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <AppShell>
      <AppHeader
        leading={
          <ButtonLink href="/" size="sm" variant="ghost">
            <ArrowLeft data-icon="inline-start" />
            Back
          </ButtonLink>
        }
      />

      <AppMain className="grid min-h-[calc(100dvh-8rem)] items-center gap-10 pb-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="max-w-xl">
          <h1 className="font-display text-5xl leading-tight font-black text-balance sm:text-6xl">
            Keep your rankings tied to one curator identity.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-lg text-base leading-8">
            Log in to manage private drafts, publish public lists, and keep
            your profile connected to every ranking you ship.
          </p>
        </section>

        <Card className="p-5 sm:p-7">
          <ToggleGroup
            aria-label="Choose authentication mode"
            className="mb-6 grid w-full grid-cols-2 rounded-full border-2 border-foreground bg-card p-1"
            onValueChange={(value) => {
              if (value) switchMode(value as AuthMode);
            }}
            spacing={0}
            type="single"
            value={mode}
          >
            <ToggleGroupItem
              className="h-10 rounded-full px-3 text-sm font-semibold text-muted-foreground hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
              value="signin"
            >
              <LogIn data-icon="inline-start" />
              Log in
            </ToggleGroupItem>
            <ToggleGroupItem
              className="h-10 rounded-full px-3 text-sm font-semibold text-muted-foreground hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
              value="signup"
            >
              <UserPlus data-icon="inline-start" />
              Sign up
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="mb-6">
            <h2 className="font-display mt-1 text-3xl font-black">
              {isSignup ? "Create your Rankex profile" : "Log in to Rankex"}
            </h2>
          </div>

          {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}
          {message ? (
            <AuthFeedback tone="success">{message}</AuthFeedback>
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <AuthField
                htmlFor="displayName"
                icon={<UserRound />}
                label="Display name"
                required
              >
                <Input
                  autoComplete="name"
                  disabled={pending}
                  id="displayName"
                  maxLength={80}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  required
                  type="text"
                  value={displayName}
                />
              </AuthField>
            ) : null}

            <AuthField htmlFor="email" icon={<Mail />} label="Email" required>
              <Input
                autoComplete="email"
                disabled={pending}
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@rankex.local"
                required
                type="email"
                value={email}
              />
            </AuthField>

            <AuthField
              htmlFor="password"
              icon={<KeyRound />}
              label="Password"
              required
            >
              <Input
                autoComplete={isSignup ? "new-password" : "current-password"}
                disabled={pending}
                id="password"
                minLength={minimumPasswordLength}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </AuthField>

            {isSignup ? (
              <AuthField
                htmlFor="confirmPassword"
                icon={<KeyRound />}
                label="Confirm password"
                required
              >
                <Input
                  autoComplete="new-password"
                  disabled={pending}
                  id="confirmPassword"
                  minLength={minimumPasswordLength}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </AuthField>
            ) : null}

            <Button className="mt-1 w-full" disabled={pending} type="submit">
              {pending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : isSignup ? (
                <UserPlus data-icon="inline-start" />
              ) : (
                <LogIn data-icon="inline-start" />
              )}
              {isSignup ? "Create profile" : "Log in"}
            </Button>
          </form>

          <div className="text-muted-foreground my-6 flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
            <div className="bg-border h-px flex-1" />
            <span>or</span>
            <div className="bg-border h-px flex-1" />
          </div>

          <form action="/api/auth/demo" method="post">
            <input name="next" type="hidden" value={next} />
            <Button
              className="w-full"
              disabled={pending}
              size="lg"
              type="submit"
              variant="outline"
            >
              Use demo account
            </Button>
          </form>
        </Card>
      </AppMain>
    </AppShell>
  );
}

function AuthField({
  children,
  htmlFor,
  icon,
  label,
  required = false,
}: {
  children: ReactNode;
  htmlFor: string;
  icon: ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label
        className="[&_svg]:text-primary inline-flex items-center gap-2 [&_svg]:size-3.5"
        htmlFor={htmlFor}
        required={required}
      >
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
