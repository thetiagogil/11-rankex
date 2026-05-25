import { cn } from "@/shared/utils/cn";

type RankBadgeProps = {
  rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      className={cn(
        "font-display grid size-11 shrink-0 place-items-center rounded-xl border text-xl font-bold shadow-none",
        rank === 1
          ? "border-foreground bg-gradient-gold text-primary-foreground"
          : "border-foreground bg-secondary text-muted-foreground",
      )}
    >
      {rank}
    </span>
  );
}
