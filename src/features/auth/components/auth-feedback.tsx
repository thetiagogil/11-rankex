import type { ReactNode } from "react";

import { Alert } from "@/shared/components/ui/alert";

type AuthFeedbackProps = {
  children: ReactNode;
  tone: "error" | "success";
};

export const AuthFeedback = ({ children, tone }: AuthFeedbackProps) => {
  return (
    <Alert className="mb-5" tone={tone}>
      {tone === "error" ? "! " : null}
      {children}
    </Alert>
  );
};
