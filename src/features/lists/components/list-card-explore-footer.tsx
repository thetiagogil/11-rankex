import { ArrowRight } from "lucide-react";

import { ListCardOwnerHandleLink } from "@/features/lists/components/list-card-owner-handle-link";
import { ListCardSocialSummary } from "@/features/lists/components/list-card-social-summary";
import type { RankedListSummary } from "@/features/lists/types";
import { ListSocialActions } from "@/features/social/components/list-social-actions";
import { getProfileUsernameLabel } from "@/shared/utils/profile";

type ListCardExploreFooterProps = {
  canUseSocialActions: boolean;
  list: RankedListSummary;
  showOwner: boolean;
};

export const ListCardExploreFooter = ({
  canUseSocialActions,
  list,
  showOwner,
}: ListCardExploreFooterProps) => {
  const ownerHandle =
    showOwner && list.owner ? getProfileUsernameLabel(list.owner) : null;

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {canUseSocialActions ? (
        <ListSocialActions
          appearance="pills"
          canRemix={false}
          className="relative z-30 shrink-0"
          listId={list.id}
          showBookmarkCount
          size="compact"
          social={list.social}
        />
      ) : (
        <ListCardSocialSummary includeBookmarks social={list.social} />
      )}

      <div className="pointer-events-none relative z-30 ml-auto flex min-w-0 items-center gap-1">
        {ownerHandle && list.owner ? (
          <ListCardOwnerHandleLink
            className="pointer-events-auto"
            owner={list.owner}
          />
        ) : null}
        <span className="text-primary group-hover:bg-primary/10 group-hover:text-accent grid size-7 place-items-center rounded-full transition group-hover:translate-x-0.5">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </div>
  );
};
