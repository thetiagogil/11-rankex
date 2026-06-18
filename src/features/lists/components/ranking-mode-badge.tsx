import { LayoutGrid, ListOrdered, Star } from "lucide-react";

import {
  getRankingModeLabel,
  normalizeRankingMode,
} from "@/features/lists/lib/ranking-mode";
import type { RankingMode } from "@/features/lists/types";
import { Badge } from "@/shared/components/ui/badge";

const rankingModeIcons: Record<RankingMode, typeof ListOrdered> = {
  ranked: ListOrdered,
  scored: Star,
  tiered: LayoutGrid,
};

type RankingModeBadgeProps = {
  rankingMode: RankingMode;
};

export const RankingModeBadge = ({ rankingMode }: RankingModeBadgeProps) => {
  const normalizedRankingMode = normalizeRankingMode(rankingMode);
  const Icon = rankingModeIcons[normalizedRankingMode];

  return (
    <Badge variant="primary">
      <Icon data-icon="inline-start" />
      {getRankingModeLabel(normalizedRankingMode)}
    </Badge>
  );
};
