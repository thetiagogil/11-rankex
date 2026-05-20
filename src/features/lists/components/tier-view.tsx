import { TierBadge } from "@/features/lists/components/tier-badge";
import { tierDescriptions, TIERS } from "@/features/lists/lib/tiers";
import type { RankedItem } from "@/features/lists/types";

type TierViewProps = {
  items: RankedItem[];
};

export function TierView({ items }: TierViewProps) {
  const untiered = items.filter((item) => !item.tier);

  return (
    <div className="space-y-3">
      {TIERS.map((tier) => {
        const tierItems = items.filter((item) => item.tier === tier);

        return (
          <section
            className="border-border bg-card/80 grid gap-3 rounded-lg border p-3 sm:grid-cols-[4rem_1fr]"
            key={tier}
          >
            <div className="flex items-center gap-3 sm:flex-col sm:justify-center">
              <TierBadge size="lg" tier={tier} />
              <span className="text-muted-foreground text-xs">
                {tierDescriptions[tier]}
              </span>
            </div>
            <div className="flex min-h-14 flex-wrap items-center gap-2">
              {tierItems.length ? (
                tierItems.map((item) => (
                  <span
                    className="bg-surface-elevated rounded-md border px-3 py-2 text-sm"
                    key={item.id}
                  >
                    {item.title}
                    {item.score !== null ? (
                      <span className="text-secondary ml-2 font-mono text-xs">
                        {item.score}
                      </span>
                    ) : null}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm italic">
                  Empty
                </span>
              )}
            </div>
          </section>
        );
      })}

      {untiered.length ? (
        <section className="border-border bg-card/40 flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-3">
          <span className="text-muted-foreground mr-2 text-xs uppercase">
            No tier
          </span>
          {untiered.map((item) => (
            <span
              className="bg-surface-elevated rounded-md border px-3 py-2 text-sm"
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
