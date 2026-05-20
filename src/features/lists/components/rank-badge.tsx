import { cn } from "@/shared/utils/cn";

type RankBadgeProps = {
  rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-lg border font-display text-lg font-bold",
        rank === 1
          ? "border-primary/40 bg-gradient-gold text-primary-foreground shadow-glow"
          : "border-border bg-secondary text-muted-foreground",
      )}
    >
      {rank}
    </span>
  );
}
