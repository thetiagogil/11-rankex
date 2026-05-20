"use client";

import { ArrowLeft, Loader2, LockKeyhole, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Button } from "@/shared/components/ui/button";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
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
          `Check ${emailValue} to confirm your account, then sign in.`,
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

      <AppMain className="flex flex-1 items-center justify-center pb-20">
        <div className="w-full max-w-md">
          <Card className="bg-card p-8">
            <div className="relative">
              <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
                <LockKeyhole className="size-3.5" />
                {isSignup ? "new curator" : "returning curator"}
              </div>
              <h1 className="mb-6 font-display text-3xl font-black">
                {isSignup ? "Create account" : "Sign in"}
              </h1>

              {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}
              {message ? (
                <AuthFeedback tone="success">{message}</AuthFeedback>
              ) : null}

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {isSignup ? (
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="displayName"
                      required
                    >
                      Display name
                    </Label>
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
                  </div>
                ) : null}

                <div className="grid gap-1.5">
                  <Label
                    htmlFor="email"
                    required
                  >
                    Email
                  </Label>
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
                </div>

                <div className="grid gap-1.5">
                  <Label
                    htmlFor="password"
                    required
                  >
                    Password
                  </Label>
                  <Input
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    disabled={pending}
                    id="password"
                    minLength={minimumPasswordLength}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={password}
                  />
                </div>

                {isSignup ? (
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      required
                    >
                      Confirm password
                    </Label>
                    <Input
                      autoComplete="new-password"
                      disabled={pending}
                      id="confirmPassword"
                      minLength={minimumPasswordLength}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      required
                      type="password"
                      value={confirmPassword}
                    />
                  </div>
                ) : null}

                <Button className="w-full" disabled={pending} type="submit">
                  {pending ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : null}
                  {isSignup ? "Create account" : "Log in"}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <div className="h-px flex-1 bg-border" />
                <span>or</span>
                <div className="h-px flex-1 bg-border" />
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
                  <Trophy data-icon="inline-start" />
                  Use demo account
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                {isSignup ? "Already have an account?" : "No account yet?"}{" "}
                <button
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => switchMode(isSignup ? "signin" : "signup")}
                  type="button"
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </AppMain>
    </AppShell>
  );
}
