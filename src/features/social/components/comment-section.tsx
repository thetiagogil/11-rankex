"use client";

import { Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import type { RankedList } from "@/features/lists/types";
import {
  createListCommentAction,
  deleteListCommentAction,
} from "@/features/social/server/actions";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state";
import { Textarea } from "@/shared/components/ui/textarea";
import { getProfileHref, getProfileInitials } from "@/shared/utils/profile";

type CommentSectionProps = {
  currentUserId: string;
  list: RankedList;
};

const commentDateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
});

export function CommentSection({ currentUserId, list }: CommentSectionProps) {
  const router = useRouter();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const trimmedBody = body.trim();
  const canComment = list.isPublic && list.ownerId !== currentUserId;
  const focusCommentInput = () => {
    commentInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    commentInputRef.current?.focus({ preventScroll: true });
  };

  return (
    <section className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl leading-none font-bold">
            Comments
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {list.comments.length}{" "}
            {list.comments.length === 1 ? "reply" : "replies"}
          </p>
        </div>
      </div>

      {canComment ? (
        <Card className="p-4 sm:p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!trimmedBody || isPending) return;
              setFeedback(null);
              startTransition(async () => {
                const result = await createListCommentAction(
                  list.id,
                  trimmedBody,
                );
                if (!result.ok) {
                  setFeedback(result.error);
                  return;
                }
                setBody("");
                router.refresh();
              });
            }}
          >
            <Textarea
              aria-label="Write a comment"
              className="min-h-24 resize-none"
              maxLength={500}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Add a thought about this ranking..."
              ref={commentInputRef}
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
      ) : null}

      {list.comments.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3">
          {list.comments.map((comment) => {
            const authorName = comment.author?.displayName ?? "Rankex curator";
            const canDelete =
              comment.userId === currentUserId ||
              list.ownerId === currentUserId;

            return (
              <Card as="article" className="p-4" key={comment.id} size="sm">
                <div className="flex items-start gap-3">
                  {comment.author ? (
                    <Link
                      className="border-foreground/45 bg-gradient-gold font-display text-primary-foreground grid size-10 shrink-0 place-items-center rounded-2xl border text-lg font-bold shadow-none"
                      href={getProfileHref(comment.author)}
                    >
                      {getProfileInitials(authorName)}
                    </Link>
                  ) : (
                    <span className="border-foreground/45 bg-secondary font-display grid size-10 shrink-0 place-items-center rounded-2xl border text-lg font-bold">
                      ?
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {comment.author ? (
                        <Link
                          className="hover:text-primary font-bold transition"
                          href={getProfileHref(comment.author)}
                        >
                          {authorName}
                        </Link>
                      ) : (
                        <span className="font-bold">{authorName}</span>
                      )}
                      <span className="text-muted-foreground text-xs">
                        {commentDateFormatter.format(
                          new Date(comment.createdAt),
                        )}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {comment.body}
                    </p>
                  </div>
                  {canDelete ? (
                    <Button
                      aria-label="Delete comment"
                      disabled={isPending}
                      onClick={() => {
                        setDeletingCommentId(comment.id);
                        startTransition(async () => {
                          const result = await deleteListCommentAction(
                            list.id,
                            comment.id,
                          );
                          setDeletingCommentId(null);
                          if (!result.ok) {
                            setFeedback(result.error);
                            return;
                          }
                          router.refresh();
                        });
                      }}
                      size="icon-sm"
                      variant="ghost"
                    >
                      {deletingCommentId === comment.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 className="text-destructive" />
                      )}
                    </Button>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          action={
            canComment ? (
              <Button onClick={focusCommentInput} type="button">
                <MessageCircle data-icon="inline-start" />
                Add comment
              </Button>
            ) : undefined
          }
          className="mt-5 min-h-48 border-border/70 bg-background/30 py-12"
          description={
            list.isPublic
              ? canComment
                ? "Be the first to leave a quick reaction."
                : "Comments from other users will appear here."
              : "Public rankings can collect a short thread of reactions."
          }
          title="No comments yet"
        />
      )}
    </section>
  );
}
