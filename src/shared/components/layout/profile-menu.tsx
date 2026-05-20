"use client";

import { Loader2, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { protectedNavLinks } from "@/shared/constants/navigation";
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
            "text-primary hover:border-primary/50 h-10 w-10 rounded-full",
            open && "border-primary/50",
          )}
          disabled={isPending}
          variant="outline"
        >
          <UserRound className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <div className="md:hidden">
          {protectedNavLinks.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <DropdownMenuItem asChild key={link.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
        </div>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
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
          tone="danger"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
