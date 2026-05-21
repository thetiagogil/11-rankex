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
              "relative inline-flex h-8 items-center rounded-full px-3 text-sm font-bold transition-colors",
              active
                ? "bg-foreground text-background shadow-[3px_3px_0_0_var(--color-primary)]"
                : "text-foreground/65 hover:bg-foreground/5 hover:text-foreground",
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
