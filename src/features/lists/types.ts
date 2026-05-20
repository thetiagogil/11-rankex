import type {
  RankexListItemRow,
  RankexListRow,
  RankexTier,
} from "@/types/database.types";
import type { Profile } from "@/shared/types";

export type Tier = RankexTier;

export type RankedItem = {
  id: number;
  listId: number;
  title: string;
  note: string | null;
  score: number | null;
  tier: Tier | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type RankedList = {
  id: number;
  ownerId: string;
  title: string;
  topic: string | null;
  emoji: string | null;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  owner: Profile | null;
  items: RankedItem[];
};

export type RankedListSummary = Omit<RankedList, "items"> & {
  itemCount: number;
  topItems: Pick<RankedItem, "id" | "position" | "title">[];
};

export type RankedListRows = {
  list: RankexListRow;
  items: RankexListItemRow[];
};
