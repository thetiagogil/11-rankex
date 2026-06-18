"use client";

import { Loader2, Send } from "lucide-react";
import type { ComponentProps, RefObject } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";

type CommentComposerProps = {
  body: string;
  feedback?: string | null;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  isPending: boolean;
  onBodyChange: (body: string) => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

export const CommentComposer = ({
  body,
  feedback,
  inputRef,
  isPending,
  onBodyChange,
  onSubmit,
}: CommentComposerProps) => {
  const trimmedBody = body.trim();

  return (
    <Card className="p-4 sm:p-5" variant="shadow">
      <form onSubmit={onSubmit}>
        <Textarea
          aria-label="Write a comment"
          className="min-h-24 resize-none"
          maxLength={500}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="Add a thought about this ranking..."
          ref={inputRef}
          value={body}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {trimmedBody.length}/500
          </p>
          <Button disabled={!trimmedBody || isPending} type="submit">
            {isPending ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <Send data-icon="inline-start" />
            )}
            Post
          </Button>
        </div>
        {feedback ? (
          <p className="text-destructive mt-3 text-sm">{feedback}</p>
        ) : null}
      </form>
    </Card>
  );
};
