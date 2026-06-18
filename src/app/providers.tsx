"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/shared/components/ui/tooltip";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};
