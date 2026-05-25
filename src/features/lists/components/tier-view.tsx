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
            className="sticker-card bg-card grid gap-3 rounded-3xl p-3 sm:grid-cols-[4rem_1fr]"
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
                    className="border-foreground/45 bg-secondary rounded-xl border px-3 py-2 text-sm font-semibold shadow-none"
                    key={item.id}
                  >
                    {item.title}
                    {item.score !== null ? (
                      <span className="text-primary ml-2 font-mono text-xs">
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
        <section className="sticker-card bg-card flex flex-wrap items-center gap-2 rounded-3xl border-dashed p-3">
          <span className="text-muted-foreground mr-2 text-xs uppercase">
            No tier
          </span>
          {untiered.map((item) => (
            <span
              className="border-foreground/45 bg-secondary rounded-xl border px-3 py-2 text-sm font-semibold shadow-none"
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
