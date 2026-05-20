import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import {
  buttonVariants,
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
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonVariants({ className, size, variant })} {...props} />
  );
}
