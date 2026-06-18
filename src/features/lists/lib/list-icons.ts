import {
  BookOpen,
  Briefcase,
  Clapperboard,
  Coffee,
  Dumbbell,
  Gamepad2,
  Music,
  Plane,
  Trophy,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import {
  resolveListIconId,
  type ListIconId,
} from "@/features/lists/lib/list-icon-data";

export { resolveListIconId };

export type ListIconOption = {
  Icon: LucideIcon;
  id: ListIconId;
  label: string;
};

export const listIconOptions = [
  { Icon: Trophy, id: "trophy", label: "Trophy" },
  { Icon: Clapperboard, id: "movies", label: "Movies" },
  { Icon: Gamepad2, id: "games", label: "Games" },
  { Icon: Music, id: "music", label: "Music" },
  { Icon: Utensils, id: "food", label: "Food" },
  { Icon: BookOpen, id: "books", label: "Books" },
  { Icon: Dumbbell, id: "sports", label: "Sports" },
  { Icon: Plane, id: "travel", label: "Travel" },
  { Icon: Coffee, id: "coffee", label: "Coffee" },
  { Icon: Briefcase, id: "work", label: "Work" },
] as const satisfies readonly ListIconOption[];

const listIconMap = new Map<ListIconId, ListIconOption>(
  listIconOptions.map((option) => [option.id, option]),
);

export const getListIcon = (value: string | null, topic: string | null) => {
  return listIconMap.get(resolveListIconId(value, topic)) ?? listIconOptions[0];
};
