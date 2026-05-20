"use client";

import { Loader2, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { protectedNavLinks } from "@/shared/constants/navigation";
import {
  isProtectedNavActive,
  ProtectedNavLinkIcon,
} from "@/shared/components/layout/protected-nav-links";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { CurrentUser } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type ProfileMenuProps = {
  currentUser: CurrentUser;
  isPending: boolean;
  onSignOut: () => void;
  pathname: string;
};

export function ProfileMenu({
  currentUser,
  isPending,
  onSignOut,
  pathname,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={open ? "Close account menu" : "Open account menu"}
          className={cn(
            "size-10 rounded-full text-primary hover:border-primary/50",
            open && "border-primary/50",
          )}
          disabled={isPending}
          variant="outline"
        >
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-semibold">
            {currentUser.profile.displayName}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {currentUser.profile.username
              ? `@${currentUser.profile.username}`
              : currentUser.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <div className="md:hidden">
          {protectedNavLinks.map((link) => {
            const active = isProtectedNavActive(pathname, link.href);

            return (
              <DropdownMenuItem asChild key={link.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  href={link.href}
                >
                  <ProtectedNavLinkIcon icon={link.icon} />
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
        </div>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            onSignOut();
          }}
          variant="destructive"
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogOut />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
