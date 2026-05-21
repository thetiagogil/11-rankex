import { cn } from "@/shared/utils/cn";

type RankBadgeProps = {
  rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl border-2 font-display text-xl font-bold shadow-[3px_3px_0_0_var(--shadow-ink)]",
        rank === 1
          ? "border-foreground bg-gradient-gold text-primary-foreground"
          : "border-foreground bg-secondary text-muted-foreground",
      )}
    >
      {rank}
    </span>
  );
}
