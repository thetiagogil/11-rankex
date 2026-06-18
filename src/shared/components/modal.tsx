"use client";

import type { ReactNode } from "react";

import {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/shared/components/modal-sections";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
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

export const Modal = ({
  bodyClassName,
  children,
  contentClassName,
  description,
  footer,
  footerClassName,
  onClose,
  open,
  title,
}: ModalProps) => {
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
          <ModalFooter className={footerClassName}>{footer}</ModalFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
