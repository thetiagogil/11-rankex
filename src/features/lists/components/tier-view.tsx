import { TierBadge } from "@/features/lists/components/tier-badge";
import { tierDescriptions, TIERS } from "@/features/lists/lib/tiers";
import type { RankedItem } from "@/features/lists/types";

type TierViewProps = {
  items: RankedItem[];
};

export function TierView({ items }: TierViewProps) {
  const untiered = items.filter((item) => !item.tier);

  return (
    <div className="flex flex-col gap-3">
      {TIERS.map((tier) => {
        const tierItems = items.filter((item) => item.tier === tier);

        return (
          <section
            className="grid gap-3 rounded-2xl border border-border bg-card/80 p-3 shadow-elevated sm:grid-cols-[4rem_1fr]"
            key={tier}
          >
            <div className="flex items-center gap-3 sm:flex-col sm:justify-center">
              <TierBadge size="lg" tier={tier} />
              <span className="text-xs text-muted-foreground">
                {tierDescriptions[tier]}
              </span>
            </div>
            <div className="flex min-h-14 flex-wrap items-center gap-2">
              {tierItems.length ? (
                tierItems.map((item) => (
                  <span
                    className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
                    key={item.id}
                  >
                    {item.title}
                    {item.score !== null ? (
                      <span className="ml-2 font-mono text-xs text-accent">
                        {item.score}
                      </span>
                    ) : null}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  Empty
                </span>
              )}
            </div>
          </section>
        );
      })}

      {untiered.length ? (
        <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 p-3">
          <span className="mr-2 text-xs text-muted-foreground uppercase">
            No tier
          </span>
          {untiered.map((item) => (
            <span
              className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              key={item.id}
            >
              {item.title}
            </span>
          ))}
        </section>
      ) : null}
    </div>
  );
}
