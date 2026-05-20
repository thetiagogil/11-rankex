import Link from "next/link";
import { Trophy } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  href?: string;
};

export function AppLogo({ href }: AppLogoProps) {
  const content = (
    <span className="group/logo flex items-center gap-2">
      <span className="bg-gradient-stage text-primary-foreground shadow-stage grid h-8 w-8 place-items-center rounded-lg transition-transform duration-500 group-hover/logo:-translate-y-0.5">
        <Trophy className="h-4 w-4" />
      </span>
      <span className={cn("font-display text-xl font-bold")}>
        Rank<span className="text-gradient-stage">ex</span>
      </span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link aria-label="Rankex home" className="inline-flex" href={href}>
      {content}
    </Link>
  );
}
