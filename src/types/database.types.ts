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

export type RankexSchema = {
  Tables: {
    lists: {
      Row: RankexListRow;
      Insert: RankexListInsert;
      Update: RankexListUpdate;
      Relationships: [
        {
          foreignKeyName: "lists_user_id_fkey";
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
  };
  Views: EmptyRecord;
  Functions: EmptyRecord;
  Enums: EmptyRecord;
  CompositeTypes: EmptyRecord;
};

export type Database = Omit<SharedDatabase, "rankex"> & {
  rankex: RankexSchema;
};
