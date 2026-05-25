"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
          "bg-card grid max-h-[min(calc(100dvh-2rem),44rem)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden p-0 sm:max-w-lg",
          contentClassName,
        )}
      >
        <DialogHeader className="border-border border-b-2 border-dashed px-5 pt-5 pb-4">
          <DialogTitle className="font-display text-3xl font-bold">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="sr-only">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div
          className={cn(
            "scrollbar-themed min-h-0 overflow-y-auto px-5 py-5",
            bodyClassName,
          )}
        >
          {children}
        </div>
        {footer ? (
          <div
            className={cn(
              "border-border flex flex-col-reverse gap-2 border-t-2 border-dashed px-5 py-4 sm:flex-row sm:justify-end",
              footerClassName,
            )}
          >
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
