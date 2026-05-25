import { Compass, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import {
  protectedNavLinks,
  type ProtectedNavLink,
} from "@/shared/constants/navigation";
import { cn } from "@/shared/utils/cn";

type ProtectedNavLinksProps = {
  pathname: string;
};

export function ProtectedNavLinks({ pathname }: ProtectedNavLinksProps) {
  return (
    <>
      {protectedNavLinks.map((link) => {
        const active = isProtectedNavActive(pathname, link.href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex h-8 items-center text-sm font-bold transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform",
              active
                ? "text-foreground after:scale-x-100"
                : "text-foreground/65 hover:text-foreground",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function isProtectedNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProtectedNavLinkIcon({
  icon,
}: {
  icon: ProtectedNavLink["icon"];
}) {
  const Icon = protectedNavIconMap[icon];

  return <Icon aria-hidden="true" className="size-4" />;
}

const protectedNavIconMap = {
  dashboard: LayoutDashboard,
  explore: Compass,
} as const satisfies Record<ProtectedNavLink["icon"], typeof LayoutDashboard>;
