"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type ModalProps = {
  open: boolean;
  description?: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({
  children,
  description,
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
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden bg-card p-0 sm:max-w-lg">
        <DialogHeader className="border-b-2 border-dashed border-border px-5 pt-5 pb-4">
          <DialogTitle className="font-display text-3xl font-bold">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="sr-only">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="scrollbar-themed min-h-0 overflow-y-auto px-5 pb-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
