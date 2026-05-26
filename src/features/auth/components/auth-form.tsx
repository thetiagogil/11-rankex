"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useMemo, useState } from "react";

import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import { getAuthModeHref } from "@/features/auth/lib/auth-routing";
import type { AuthMode } from "@/features/auth/types";
import { DividerLabel } from "@/shared/components/divider-label";
import { FormField } from "@/shared/components/form-field";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { createClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  initialError?: string | null;
  mode: AuthMode;
  next?: string;
};

const minimumPasswordLength = 8;

export function AuthForm({
  initialError,
  mode,
  next = "/dashboard",
}: AuthFormProps) {
  const router = useRouter();
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
  const alternateHref = getAuthModeHref(isSignup ? "login" : "signup", next);

  const validate = () => {
    if (isSignup && !displayName.trim()) {
      return "Display name is required.";
    }
    if (!emailValue) return "Email is required.";
    if (password.length < minimumPasswordLength) {
      return `Password must be at least ${minimumPasswordLength} characters.`;
    }
    if (isSignup && password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
        setMessage(`Check ${emailValue} to confirm your account, then log in.`);
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
      <AppMain className="flex min-h-[100dvh] items-center justify-center py-10 sm:py-14">
        <section className="flex w-full max-w-md flex-col items-center">
          <AppLogo href="/" />

          <Card className="bg-card/90 mt-8 w-full p-0 backdrop-blur">
            <CardHeader className="gap-1 px-6 pt-7 sm:px-8 sm:pt-8">
              <CardTitle className="text-3xl">
                {isSignup ? "Create your account" : "Welcome back"}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {isSignup
                  ? "Start ranking what you love."
                  : "Log in to access your rankings."}
              </p>
            </CardHeader>

            <CardContent className="px-6 sm:px-8">
              {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}
              {message ? (
                <AuthFeedback tone="success">{message}</AuthFeedback>
              ) : null}

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {isSignup ? (
                  <FormField
                    htmlFor="displayName"
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
                  </FormField>
                ) : null}

                <FormField htmlFor="email" label="Email" required>
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
                </FormField>

                <FormField htmlFor="password" label="Password" required>
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
                </FormField>

                {isSignup ? (
                  <FormField
                    htmlFor="confirmPassword"
                    label="Confirm password"
                    required
                  >
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
                  </FormField>
                ) : null}

                <Button
                  className="mt-1 w-full"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? (
                    <Loader2
                      className="animate-spin"
                      data-icon="inline-start"
                    />
                  ) : null}
                  {isSignup ? "Create account" : "Log in"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4 border-t-0 bg-transparent px-6 pb-6 sm:px-8 sm:pb-8">
              {!isSignup ? (
                <>
                  <DividerLabel>or</DividerLabel>
                  <form
                    action="/api/auth/demo"
                    className="w-full"
                    method="post"
                  >
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
                </>
              ) : null}

              <p className="text-muted-foreground w-full text-center text-sm">
                {isSignup ? "Already have an account?" : "No account yet?"}{" "}
                <Link
                  className="text-foreground font-bold underline-offset-4 hover:underline"
                  href={alternateHref}
                >
                  {isSignup ? "Log in" : "Create account"}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </section>
      </AppMain>
    </AppShell>
  );
}
