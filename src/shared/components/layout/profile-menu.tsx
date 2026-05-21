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
import { cn } from "@/shared/utils/cn";

type ProfileMenuProps = {
  isPending: boolean;
  onSignOut: () => void;
  pathname: string;
};

export function ProfileMenu({
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
            "size-11 rounded-full text-primary hover:border-primary/50",
            open && "border-primary/50",
          )}
          disabled={isPending}
          variant="outline"
        >
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 shadow-none" align="end">
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
          <Link href="/profile">
            <UserRound data-icon="inline-start" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings data-icon="inline-start" />
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
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <LogOut data-icon="inline-start" />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
