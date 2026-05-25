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
    <div className="border-foreground/20 bg-background/35 flex items-center gap-1 rounded-2xl border p-1">
      {protectedNavLinks.map((link) => {
        const active = isProtectedNavActive(pathname, link.href);
        const Icon = protectedNavIconMap[link.icon];

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-sm font-bold transition-all",
              active
                ? "bg-foreground text-background"
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
            )}
            href={link.href}
            key={link.href}
          >
            <Icon aria-hidden="true" className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </div>
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
