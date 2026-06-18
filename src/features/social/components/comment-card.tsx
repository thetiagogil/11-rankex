"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

import { commentDateFormatter } from "@/features/social/lib/comment-date";
import type { ListComment } from "@/features/lists/types";
import { ProfileAvatar } from "@/shared/components/profile-avatar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { getProfileHref } from "@/shared/utils/profile";

type CommentCardProps = {
  canDelete: boolean;
  comment: ListComment;
  isDeleting: boolean;
  isPending: boolean;
  onDelete: (commentId: number) => void;
};

export const CommentCard = ({
  canDelete,
  comment,
  isDeleting,
  isPending,
  onDelete,
}: CommentCardProps) => {
  const authorName = comment.author?.displayName ?? "Rankex profile";

  return (
    <Card as="article" className="p-4" size="sm" variant="shadow">
      <div className="flex items-start gap-3">
        {comment.author ? (
          <Link className="shrink-0" href={getProfileHref(comment.author)}>
            <ProfileAvatar displayName={authorName} size="sm" />
          </Link>
        ) : (
          <ProfileAvatar displayName="?" size="sm" tone="muted" />
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
              {commentDateFormatter.format(new Date(comment.createdAt))}
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
            onClick={() => onDelete(comment.id)}
            size="icon-sm"
            variant="ghost"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 className="text-destructive" />
            )}
          </Button>
        ) : null}
      </div>
    </Card>
  );
};
