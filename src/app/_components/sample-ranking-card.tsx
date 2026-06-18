import type {
  LandingSampleDeckLayout,
  LandingSampleRanking,
} from "@/content/landing.types";
import { Card } from "@/shared/components/ui/card";

type SampleRankingCardProps = {
  layout: LandingSampleDeckLayout;
  ranking: LandingSampleRanking;
};

export const SampleRankingCard = ({
  layout,
  ranking,
}: SampleRankingCardProps) => {
  const Icon = ranking.icon;

  return (
    <Card
      as="article"
      className="absolute w-64 rounded-3xl p-5"
      style={{
        left: layout.left,
        top: layout.top,
        transform: `rotate(${layout.rotate}deg)`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-foreground grid size-11 shrink-0 place-items-center rounded-2xl"
          style={{ background: ranking.accent }}
        >
          <Icon className="size-5" strokeWidth={2.5} />
        </span>
        <span
          className="text-foreground rounded-lg px-2 py-0.5 text-[10px] font-black tracking-widest uppercase"
          style={{ background: ranking.accent }}
        >
          {ranking.topic}
        </span>
      </div>
      <h3 className="font-display mt-3 text-xl leading-tight font-bold">
        {ranking.title}
      </h3>
      <ol className="mt-3 flex flex-col gap-1.5 text-sm">
        {ranking.items.map((item, index) => (
          <li className="flex items-center gap-2" key={item}>
            <span
              className="font-display flex size-5 shrink-0 items-center justify-center rounded-md text-xs font-black"
              style={{ background: ranking.accent }}
            >
              {index + 1}
            </span>
            <span className="text-foreground/80 min-w-0 truncate">{item}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
};
