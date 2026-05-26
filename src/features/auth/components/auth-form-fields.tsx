import { Input } from "@/shared/components/ui/input";
import { FormField } from "@/shared/components/form-field";

type AuthFormFieldsProps = {
  confirmPassword: string;
  displayName: string;
  email: string;
  isSignup: boolean;
  minimumPasswordLength: number;
  onConfirmPasswordChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  password: string;
  pending: boolean;
};

export function AuthFormFields({
  confirmPassword,
  displayName,
  email,
  isSignup,
  minimumPasswordLength,
  onConfirmPasswordChange,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  password,
  pending,
}: AuthFormFieldsProps) {
  return (
    <>
      {isSignup ? (
        <FormField htmlFor="displayName" label="Display name" required>
          <Input
            autoComplete="name"
            disabled={pending}
            id="displayName"
            maxLength={80}
            onChange={(event) => onDisplayNameChange(event.target.value)}
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
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@rankex.local"
          required
          type="email"
          value={email}
        />
      </FormField>

      <FormField htmlFor="password" label="Password" required>
        <Input
          autoComplete={isSignup ? "new-password" : "current-password"}
          disabled={pending}
          id="password"
          minLength={minimumPasswordLength}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Enter your password"
          required
          type="password"
          value={password}
        />
      </FormField>

      {isSignup ? (
        <FormField htmlFor="confirmPassword" label="Confirm password" required>
          <Input
            autoComplete="new-password"
            disabled={pending}
            id="confirmPassword"
            minLength={minimumPasswordLength}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder="Confirm your password"
            required
            type="password"
            value={confirmPassword}
          />
        </FormField>
      ) : null}
    </>
  );
}
