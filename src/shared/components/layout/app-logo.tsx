import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  href?: string;
};

export function AppLogo({ href }: AppLogoProps) {
  const content = (
    <span className="group/logo flex items-center gap-2.5">
      <span className="grid size-11 rotate-[-6deg] place-items-center rounded-2xl bg-gradient-gold shadow-elevated transition-transform duration-300 group-hover/logo:rotate-[6deg]">
        <Image
          alt=""
          className="size-8"
          height={32}
          src="/favicon.svg"
          width={32}
        />
      </span>
      <span className={cn("font-display text-3xl font-bold leading-none tracking-normal")}>
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
