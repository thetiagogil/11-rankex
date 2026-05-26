"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/utils/cn";

type ModalProps = {
  bodyClassName?: string;
  children: ReactNode;
  contentClassName?: string;
  description?: string;
  footer?: ReactNode;
  footerClassName?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Modal({
  bodyClassName,
  children,
  contentClassName,
  description,
  footer,
  footerClassName,
  onClose,
  open,
  title,
}: ModalProps) {
  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogContent
        className={cn(
          "bg-card grid max-h-[min(calc(100dvh-2rem),44rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-lg",
          contentClassName,
        )}
      >
        <ModalHeader description={description} title={title} />
        <ModalBody className={bodyClassName}>{children}</ModalBody>
        {footer ? (
          <ModalFooter className={footerClassName}>
            {footer}
          </ModalFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ModalHeader({
  description,
  title,
}: {
  description?: string;
  title: string;
}) {
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
}

function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="scrollbar-themed min-h-0 overflow-x-hidden overflow-y-auto">
      <div className={cn("px-5 py-5", className)}>{children}</div>
    </div>
  );
}

function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
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
}
