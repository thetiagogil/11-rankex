import type { ReactNode } from "react";

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/utils/cn";

type ModalHeaderProps = {
  description?: string;
  title: string;
};

export const ModalHeader = ({ description, title }: ModalHeaderProps) => {
  return (
    <DialogHeader className="border-border border-b-2 border-dashed px-5 pt-5 pb-4">
      <DialogTitle className="font-display text-3xl font-bold">
        {title}
      </DialogTitle>
      {description ? (
        <DialogDescription className="sr-only">{description}</DialogDescription>
      ) : null}
    </DialogHeader>
  );
};

type ModalBodyProps = {
  children: ReactNode;
  className?: string;
};

export const ModalBody = ({ children, className }: ModalBodyProps) => {
  return (
    <div className="scrollbar-themed min-h-0 overflow-x-hidden overflow-y-auto">
      <div className={cn("px-5 py-5", className)}>{children}</div>
    </div>
  );
};

type ModalFooterProps = {
  children: ReactNode;
  className?: string;
};

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return (
    <DialogFooter
      className={cn(
        "border-border border-t-2 border-dashed px-5 py-4",
        className,
      )}
    >
      {children}
    </DialogFooter>
  );
};
