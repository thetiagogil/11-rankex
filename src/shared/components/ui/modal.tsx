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
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden border-primary/30 bg-card/95 p-0 shadow-elevated sm:max-w-lg">
        <DialogHeader className="border-b border-border/80 px-5 pt-5 pb-4">
          <DialogTitle className="font-display text-xl font-bold">
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
