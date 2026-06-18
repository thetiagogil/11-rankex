export const minimumPasswordLength = 8;

type ValidateAuthInputOptions = {
  displayName: string;
  email: string;
  isSignup: boolean;
  password: string;
  confirmPassword: string;
};

export const validateAuthInput = ({
  confirmPassword,
  displayName,
  email,
  isSignup,
  password,
}: ValidateAuthInputOptions) => {
  if (isSignup && !displayName.trim()) {
    return "Display name is required.";
  }
  if (!email) return "Email is required.";
  if (password.length < minimumPasswordLength) {
    return `Password must be at least ${minimumPasswordLength} characters.`;
  }
  if (isSignup && password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
};
