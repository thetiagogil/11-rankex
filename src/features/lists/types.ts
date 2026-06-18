import type { Profile } from "@/shared/types";
import type { Tables } from "@/types/database.types";

export type RankingMode = "ranked" | "scored" | "tiered";
export type Tier = "S" | "A" | "B" | "C" | "D";
export type RankexListRow = Tables<{ schema: "rankex" }, "lists">;
export type RankexListItemRow = Tables<{ schema: "rankex" }, "list_items">;
export type RankexListCommentRow = Tables<
  { schema: "rankex" },
  "list_comments"
>;

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
  rankingMode: RankingMode;
  remixedFromListId: number | null;
  remixedFromUserId: string | null;
  createdAt: string;
  updatedAt: string;
  owner: Profile | null;
  items: RankedItem[];
  remixSource: RemixSource | null;
  social: ListSocialState;
  comments: ListComment[];
};

export type RankedListSummary = Omit<RankedList, "comments" | "items"> & {
  itemCount: number;
  topItems: Pick<RankedItem, "id" | "position" | "title">[];
};

export type RankedListRows = {
  list: RankexListRow;
  items: RankexListItemRow[];
};

export type RemixSource = {
  id: number;
  owner: Profile | null;
  title: string;
};

export type ListSocialState = {
  bookmarkCount: number;
  commentCount: number;
  isBookmarkedByViewer: boolean;
  isLikedByViewer: boolean;
  likeCount: number;
};

export type ListComment = {
  author: Profile | null;
  body: string;
  createdAt: string;
  id: number;
  listId: number;
  updatedAt: string;
  userId: string;
};

export type ListCommentRows = {
  author: Profile | null;
  comment: RankexListCommentRow;
};
