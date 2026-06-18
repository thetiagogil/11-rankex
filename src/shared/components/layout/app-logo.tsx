import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  href?: string;
};

export const AppLogo = ({ href }: AppLogoProps) => {
  const content = (
    <span className="group/logo flex items-center gap-2.5">
      <span className="grid size-11 rotate-[-6deg] place-items-center transition-transform duration-300 group-hover/logo:rotate-[6deg]">
        <Image
          alt=""
          className="size-11 rounded-2xl"
          height={44}
          src="/favicon.svg"
          width={44}
        />
      </span>
      <span
        className={cn(
          "font-display text-3xl leading-none font-bold tracking-normal",
        )}
      >
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
};
