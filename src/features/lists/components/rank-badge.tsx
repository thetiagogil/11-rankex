import { cn } from "@/shared/utils/cn";

type RankBadgeProps = {
  rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      className={cn(
        "font-display grid h-10 w-10 shrink-0 place-items-center rounded-lg border text-base font-bold",
        rank === 1
          ? "bg-gradient-stage text-primary-foreground border-primary/40 shadow-stage"
          : "bg-surface-elevated text-muted-foreground border-border",
      )}
    >
      {rank}
    </span>
  );
}
