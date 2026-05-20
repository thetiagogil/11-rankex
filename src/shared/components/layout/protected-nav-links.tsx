import { Compass, LayoutDashboard, UserRound } from "lucide-react";
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
              "relative inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            href={link.href}
            key={link.href}
          >
            <ProtectedNavLinkIcon icon={link.icon} />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function isProtectedNavActive(pathname: string, href: string) {
  if (href === "/profile") {
    return pathname === href || pathname.startsWith("/u/");
  }

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
  profile: UserRound,
} as const satisfies Record<ProtectedNavLink["icon"], typeof LayoutDashboard>;
