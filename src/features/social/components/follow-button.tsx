"use client";

import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleFollowAction } from "@/features/social/server/actions";
import { Button, type ButtonSize } from "@/shared/components/ui/button";

type FollowButtonProps = {
  className?: string;
  initialIsFollowing: boolean;
  profileId: string;
  size?: ButtonSize;
};

export function FollowButton({
  className,
  initialIsFollowing,
  profileId,
  size = "sm",
}: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className={className}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleFollowAction(profileId);
          if (!result.ok) return;
          setIsFollowing(result.data.following);
          router.refresh();
        });
      }}
      size={size}
      variant={isFollowing ? "outline" : "default"}
    >
      {isPending ? (
        <Loader2 className="animate-spin" data-icon="inline-start" />
      ) : isFollowing ? (
        <UserCheck data-icon="inline-start" />
      ) : (
        <UserPlus data-icon="inline-start" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
