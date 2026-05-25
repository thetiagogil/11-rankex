import type { Database as SharedDatabase } from "@thetiagogil/shared-db-types";

type EmptyRecord = {
  [_ in never]: never;
};

export type RankexTier = "S" | "A" | "B" | "C" | "D";

export type RankexListRow = {
  created_at: string;
  description: string | null;
  emoji: string | null;
  id: number;
  is_public: boolean;
  remixed_from_list_id: number | null;
  remixed_from_user_id: string | null;
  title: string;
  topic: string | null;
  updated_at: string;
  user_id: string;
};

export type RankexListInsert = {
  created_at?: string;
  description?: string | null;
  emoji?: string | null;
  id?: never;
  is_public?: boolean;
  remixed_from_list_id?: number | null;
  remixed_from_user_id?: string | null;
  title: string;
  topic?: string | null;
  updated_at?: string;
  user_id: string;
};

export type RankexListUpdate = {
  created_at?: string;
  description?: string | null;
  emoji?: string | null;
  id?: never;
  is_public?: boolean;
  remixed_from_list_id?: number | null;
  remixed_from_user_id?: string | null;
  title?: string;
  topic?: string | null;
  updated_at?: string;
  user_id?: string;
};

export type RankexListItemRow = {
  created_at: string;
  id: number;
  list_id: number;
  note: string | null;
  position: number;
  score: number | null;
  tier: RankexTier | null;
  title: string;
  updated_at: string;
};

export type RankexListItemInsert = {
  created_at?: string;
  id?: never;
  list_id: number;
  note?: string | null;
  position: number;
  score?: number | null;
  tier?: RankexTier | null;
  title: string;
  updated_at?: string;
};

export type RankexListItemUpdate = {
  created_at?: string;
  id?: never;
  list_id?: number;
  note?: string | null;
  position?: number;
  score?: number | null;
  tier?: RankexTier | null;
  title?: string;
  updated_at?: string;
};

export type RankexFollowRow = {
  created_at: string;
  follower_id: string;
  following_id: string;
};

export type RankexFollowInsert = {
  created_at?: string;
  follower_id: string;
  following_id: string;
};

export type RankexFollowUpdate = {
  created_at?: string;
  follower_id?: string;
  following_id?: string;
};

export type RankexListLikeRow = {
  created_at: string;
  list_id: number;
  user_id: string;
};

export type RankexListLikeInsert = {
  created_at?: string;
  list_id: number;
  user_id: string;
};

export type RankexListLikeUpdate = {
  created_at?: string;
  list_id?: number;
  user_id?: string;
};

export type RankexListBookmarkRow = {
  created_at: string;
  list_id: number;
  user_id: string;
};

export type RankexListBookmarkInsert = {
  created_at?: string;
  list_id: number;
  user_id: string;
};

export type RankexListBookmarkUpdate = {
  created_at?: string;
  list_id?: number;
  user_id?: string;
};

export type RankexListCommentRow = {
  body: string;
  created_at: string;
  id: number;
  list_id: number;
  updated_at: string;
  user_id: string;
};

export type RankexListCommentInsert = {
  body: string;
  created_at?: string;
  id?: never;
  list_id: number;
  updated_at?: string;
  user_id: string;
};

export type RankexListCommentUpdate = {
  body?: string;
  created_at?: string;
  id?: never;
  list_id?: number;
  updated_at?: string;
  user_id?: string;
};

export type RankexSchema = {
  Tables: {
    follows: {
      Row: RankexFollowRow;
      Insert: RankexFollowInsert;
      Update: RankexFollowUpdate;
      Relationships: [
        {
          foreignKeyName: "follows_follower_id_fkey";
          columns: ["follower_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "follows_following_id_fkey";
          columns: ["following_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
      ];
    };
    lists: {
      Row: RankexListRow;
      Insert: RankexListInsert;
      Update: RankexListUpdate;
      Relationships: [
        {
          foreignKeyName: "lists_remixed_from_list_id_fkey";
          columns: ["remixed_from_list_id"];
          isOneToOne: false;
          referencedRelation: "lists";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "lists_remixed_from_user_id_fkey";
          columns: ["remixed_from_user_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "lists_user_id_fkey";
          columns: ["user_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
      ];
    };
    list_bookmarks: {
      Row: RankexListBookmarkRow;
      Insert: RankexListBookmarkInsert;
      Update: RankexListBookmarkUpdate;
      Relationships: [
        {
          foreignKeyName: "list_bookmarks_list_id_fkey";
          columns: ["list_id"];
          isOneToOne: false;
          referencedRelation: "lists";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "list_bookmarks_user_id_fkey";
          columns: ["user_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
      ];
    };
    list_comments: {
      Row: RankexListCommentRow;
      Insert: RankexListCommentInsert;
      Update: RankexListCommentUpdate;
      Relationships: [
        {
          foreignKeyName: "list_comments_list_id_fkey";
          columns: ["list_id"];
          isOneToOne: false;
          referencedRelation: "lists";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "list_comments_user_id_fkey";
          columns: ["user_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
      ];
    };
    list_items: {
      Row: RankexListItemRow;
      Insert: RankexListItemInsert;
      Update: RankexListItemUpdate;
      Relationships: [
        {
          foreignKeyName: "list_items_list_id_fkey";
          columns: ["list_id"];
          isOneToOne: false;
          referencedRelation: "lists";
          referencedColumns: ["id"];
        },
      ];
    };
    list_likes: {
      Row: RankexListLikeRow;
      Insert: RankexListLikeInsert;
      Update: RankexListLikeUpdate;
      Relationships: [
        {
          foreignKeyName: "list_likes_list_id_fkey";
          columns: ["list_id"];
          isOneToOne: false;
          referencedRelation: "lists";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "list_likes_user_id_fkey";
          columns: ["user_id"];
          isOneToOne: false;
          referencedRelation: "profiles";
          referencedColumns: ["id"];
        },
      ];
    };
  };
  Views: EmptyRecord;
  Functions: EmptyRecord;
  Enums: EmptyRecord;
  CompositeTypes: EmptyRecord;
};

export type Database = Omit<SharedDatabase, "rankex"> & {
  rankex: RankexSchema;
};
