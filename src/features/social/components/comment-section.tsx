"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import type { RankedList } from "@/features/lists/types";
import { CommentCard } from "@/features/social/components/comment-card";
import { CommentComposer } from "@/features/social/components/comment-composer";
import {
  createListCommentAction,
  deleteListCommentAction,
} from "@/features/social/server/actions";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/empty-state";

type CommentSectionProps = {
  currentUserId: string;
  list: RankedList;
};

export const CommentSection = ({
  currentUserId,
  list,
}: CommentSectionProps) => {
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
        <CommentComposer
          body={body}
          feedback={feedback}
          inputRef={commentInputRef}
          isPending={isPending}
          onBodyChange={setBody}
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
        />
      ) : null}

      {list.comments.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3">
          {list.comments.map((comment) => {
            const canDelete =
              comment.userId === currentUserId ||
              list.ownerId === currentUserId;

            return (
              <CommentCard
                canDelete={canDelete}
                comment={comment}
                isDeleting={deletingCommentId === comment.id}
                isPending={isPending}
                key={comment.id}
                onDelete={(commentId) => {
                  setDeletingCommentId(commentId);
                  startTransition(async () => {
                    const result = await deleteListCommentAction(
                      list.id,
                      commentId,
                    );
                    setDeletingCommentId(null);
                    if (!result.ok) {
                      setFeedback(result.error);
                      return;
                    }
                    router.refresh();
                  });
                }}
              />
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
          className="mt-5 min-h-48 py-12"
          description={
            list.isPublic
              ? canComment
                ? "Be the first to comment."
                : "Comments from other people will appear here."
              : "Public lists can receive comments."
          }
          title="No comments yet"
        />
      )}
    </section>
  );
};
