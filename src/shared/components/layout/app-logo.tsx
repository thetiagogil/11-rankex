import Link from "next/link";
import { Trophy } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  href?: string;
};

export function AppLogo({ href }: AppLogoProps) {
  const content = (
    <span className="group/logo flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-glow transition-transform duration-500 group-hover/logo:-translate-y-0.5">
        <Trophy className="size-5" />
      </span>
      <span className={cn("font-display text-xl font-bold tracking-normal")}>
        Rank<span className="text-primary">ex</span>
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
