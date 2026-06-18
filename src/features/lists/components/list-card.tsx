import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ListCardExploreFooter } from "@/features/lists/components/list-card-explore-footer";
import { ListCardOwnerHandleLink } from "@/features/lists/components/list-card-owner-handle-link";
import { ListCardSocialSummary } from "@/features/lists/components/list-card-social-summary";
import { RankingModeBadge } from "@/features/lists/components/ranking-mode-badge";
import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import { getListIcon } from "@/features/lists/lib/list-icons";
import {
  getListCardAccent,
  getListCardTilt,
} from "@/features/lists/lib/list-card-style";
import type { RankedListSummary } from "@/features/lists/types";
import { ListSocialActions } from "@/features/social/components/list-social-actions";
import { Card } from "@/shared/components/ui/card";
import type { CardVariant } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type ListCardProps = {
  cardVariant?: Extract<CardVariant, "shadow" | "tilt">;
  currentUserId?: string;
  footerMode?: "default" | "explore";
  list: RankedListSummary;
  showOwner?: boolean;
};

export const ListCard = ({
  cardVariant = "shadow",
  currentUserId,
  footerMode = "default",
  list,
  showOwner = false,
}: ListCardProps) => {
  const listIcon = getListIcon(list.emoji, list.topic);
  const Icon = listIcon.Icon;
  const accent = getListCardAccent(list.id);
  const tilt = cardVariant === "tilt" ? getListCardTilt(list.id) : "";
  const canUseSocialActions = Boolean(
    currentUserId && list.isPublic && list.ownerId !== currentUserId,
  );
  const canRemix = Boolean(
    currentUserId && list.isPublic && list.ownerId !== currentUserId,
  );
  const useExploreFooter = footerMode === "explore";

  return (
    <Card
      as="article"
      className={cn("group min-w-0 gap-0 p-0", tilt)}
      variant={cardVariant}
    >
      <Link
        aria-label={`Open ${list.title}`}
        className="focus-visible:ring-ring absolute inset-0 z-20 rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={`/lists/${list.id}`}
      />

      <div className="relative z-10 min-w-0 p-4 pb-3">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="border-foreground/35 text-foreground grid size-11 shrink-0 place-items-center rounded-xl border"
                style={{ background: accent }}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={2.4} />
              </span>
              <p className="text-muted-foreground truncate font-mono text-[10px] tracking-widest uppercase">
                {list.topic ?? "General"}
              </p>
            </div>
            {useExploreFooter ? (
              <RankingModeBadge rankingMode={list.rankingMode} />
            ) : (
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                <RankingModeBadge rankingMode={list.rankingMode} />
                <VisibilityBadge iconOnly isPublic={list.isPublic} />
              </div>
            )}
          </div>

          <div className="mt-4 min-w-0">
            <h3 className="font-display group-hover:text-primary text-xl leading-tight font-bold transition-colors">
              {list.title}
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-2 min-h-12 text-sm leading-6">
              {list.description ?? ""}
            </p>
          </div>
        </div>
      </div>

      <div className="border-border bg-background/20 relative z-10 flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-dashed px-4 py-3">
        {useExploreFooter ? (
          <ListCardExploreFooter
            canUseSocialActions={canUseSocialActions}
            list={list}
            showOwner={showOwner}
          />
        ) : (
          <>
            {showOwner && list.owner ? (
              <ListCardOwnerHandleLink owner={list.owner} />
            ) : (
              <ListCardSocialSummary social={list.social} />
            )}

            <div className="flex items-center gap-2">
              {canUseSocialActions ? (
                <ListSocialActions
                  canRemix={canRemix}
                  className="relative z-30"
                  listId={list.id}
                  size="compact"
                  social={list.social}
                />
              ) : null}
              <span className="text-primary group-hover:bg-primary/10 group-hover:text-accent pointer-events-none grid size-7 place-items-center rounded-full transition group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
