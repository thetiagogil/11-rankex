import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/shared/components/ui/button";

type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    size?: ButtonSize;
    variant?: ButtonVariant;
  };

export function ButtonLink({
  children,
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Button asChild className={className} size={size} variant={variant}>
      <Link {...props}>{children}</Link>
    </Button>
  );
}
