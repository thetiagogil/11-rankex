import {
  defaultLandingSampleDeckLayout,
  landingSampleDeckLayout,
  landingSampleRankings,
} from "@/content/landing";
import { SampleRankingCard } from "@/app/_components/sample-ranking-card";

export function SampleRankingDeck() {
  return (
    <div className="relative mx-auto h-90 w-full max-w-md overflow-visible sm:h-97.5 lg:mt-0">
      <div className="absolute top-0 left-1/2 h-97.5 w-105 -translate-x-1/2 scale-[0.86] sm:scale-95 lg:scale-100">
        {landingSampleRankings.map((ranking, index) => (
          <SampleRankingCard
            key={ranking.title}
            layout={
              landingSampleDeckLayout[index] ?? defaultLandingSampleDeckLayout
            }
            ranking={ranking}
          />
        ))}
      </div>
    </div>
  );
}
