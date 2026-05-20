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
              "relative inline-flex h-9 items-center gap-1.5 text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform",
              active
                ? "text-primary after:scale-x-100"
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
