import type {
  RankexListCommentRow,
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
