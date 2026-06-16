"use client";

import { Loader2 } from "lucide-react";

import { AuthCardFooter } from "@/features/auth/components/auth-card-footer";
import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import { AuthFormFields } from "@/features/auth/components/auth-form-fields";
import { useAuthForm } from "@/features/auth/hooks/use-auth-form";
import { minimumPasswordLength } from "@/features/auth/lib/auth-validation";
import type { AuthFormProps } from "@/features/auth/types";
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

export function AuthForm({
  initialError,
  mode,
  next = "/dashboard",
}: AuthFormProps) {
  const authForm = useAuthForm({ initialError, mode, next });

  return (
    <AppShell>
      <AppMain className="flex min-h-[100dvh] items-center justify-center py-10 sm:py-14">
        <section className="flex w-full max-w-md flex-col items-center">
          <AppLogo href="/" />

          <Card className="bg-card/95 mt-8 w-full p-0 backdrop-blur">
            <CardHeader className="gap-1 px-6 pt-7 sm:px-8 sm:pt-8">
              <CardTitle className="text-3xl">
                {authForm.isSignup ? "Create your account" : "Welcome back"}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {authForm.isSignup
                  ? "Start ranking what you love."
                  : "Log in to access your rankings."}
              </p>
            </CardHeader>

            <CardContent className="px-6 sm:px-8">
              {authForm.error ? (
                <AuthFeedback tone="error">{authForm.error}</AuthFeedback>
              ) : null}
              {authForm.message ? (
                <AuthFeedback tone="success">{authForm.message}</AuthFeedback>
              ) : null}

              <form
                className="flex flex-col gap-4"
                onSubmit={authForm.handleSubmit}
              >
                <AuthFormFields
                  confirmPassword={authForm.confirmPassword}
                  displayName={authForm.displayName}
                  email={authForm.email}
                  isSignup={authForm.isSignup}
                  minimumPasswordLength={minimumPasswordLength}
                  onConfirmPasswordChange={authForm.setConfirmPassword}
                  onDisplayNameChange={authForm.setDisplayName}
                  onEmailChange={authForm.setEmail}
                  onPasswordChange={authForm.setPassword}
                  password={authForm.password}
                  pending={authForm.pending}
                />

                <Button
                  className="mt-1 w-full"
                  disabled={authForm.pending}
                  type="submit"
                >
                  {authForm.pending ? (
                    <Loader2
                      className="animate-spin"
                      data-icon="inline-start"
                    />
                  ) : null}
                  {authForm.isSignup ? "Create account" : "Log in"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4 border-t-0 bg-transparent px-6 pt-0 pb-6 sm:px-8 sm:pb-8">
              <AuthCardFooter
                alternateHref={authForm.alternateHref}
                isSignup={authForm.isSignup}
                next={authForm.next}
                pending={authForm.pending}
              />
            </CardFooter>
          </Card>
        </section>
      </AppMain>
    </AppShell>
  );
}
