import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  href?: string;
};

export function AppLogo({ href }: AppLogoProps) {
  const content = (
    <span className="group/logo flex items-center gap-2.5">
      <Image
        alt=""
        className="size-9 rounded-xl transition-transform duration-500 group-hover/logo:-translate-y-0.5"
        height={36}
        src="/favicon.svg"
        width={36}
      />
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
