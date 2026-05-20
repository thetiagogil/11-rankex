"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

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
    <DialogPrimitive.Root
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden focus-visible:outline-none">
          <Card
            className="max-h-[calc(100dvh-6rem)] overflow-hidden p-0"
            gradient
            tone="primary"
          >
            <div className="relative z-10 flex max-h-[calc(100dvh-6rem)] flex-col">
              <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-5 pb-4">
                <DialogPrimitive.Title className="font-display text-glow-primary text-sm tracking-wider uppercase">
                  {title}
                </DialogPrimitive.Title>
                {description ? (
                  <DialogPrimitive.Description className="sr-only">
                    {description}
                  </DialogPrimitive.Description>
                ) : null}
                <DialogPrimitive.Close asChild>
                  <Button aria-label="Close" size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogPrimitive.Close>
              </div>
              <div className="scrollbar-themed min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
                {children}
              </div>
            </div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
