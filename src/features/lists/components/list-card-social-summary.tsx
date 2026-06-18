import { Bookmark, Heart, MessageCircle } from "lucide-react";

import type { RankedListSummary } from "@/features/lists/types";
import { CountPill } from "@/shared/components/count-pill";

type ListCardSocialSummaryProps = {
  includeBookmarks?: boolean;
  social: RankedListSummary["social"];
};

export const ListCardSocialSummary = ({
  includeBookmarks = false,
  social,
}: ListCardSocialSummaryProps) => {
  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold">
      <CountPill
        icon={<Heart data-icon="inline-start" />}
        singularLabel="like"
        value={social.likeCount}
      />
      <CountPill
        icon={<MessageCircle data-icon="inline-start" />}
        singularLabel="comment"
        value={social.commentCount}
      />
      {includeBookmarks ? (
        <CountPill
          icon={<Bookmark data-icon="inline-start" />}
          singularLabel="bookmark"
          value={social.bookmarkCount}
        />
      ) : null}
    </div>
  );
};
