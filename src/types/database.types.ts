export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  core: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  easyqa: {
    Tables: {
      answers: {
        Row: {
          accepted: boolean
          content: string
          created_at: string
          id: number
          question_id: number
          updated_at: string
          user_id: string
          vote_score: number
        }
        Insert: {
          accepted?: boolean
          content: string
          created_at?: string
          id?: never
          question_id: number
          updated_at?: string
          user_id: string
          vote_score?: number
        }
        Update: {
          accepted?: boolean
          content?: string
          created_at?: string
          id?: never
          question_id?: number
          updated_at?: string
          user_id?: string
          vote_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          answer_id: number | null
          created_at: string
          id: number
          is_read: boolean
          question_id: number | null
          read_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          answer_id?: number | null
          created_at?: string
          id?: never
          is_read?: boolean
          question_id?: number | null
          read_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          answer_id?: number | null
          created_at?: string
          id?: never
          is_read?: boolean
          question_id?: number | null
          read_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer_count: number
          content: string
          created_at: string
          id: number
          status: string
          title: string
          updated_at: string
          user_id: string
          vote_score: number
        }
        Insert: {
          answer_count?: number
          content: string
          created_at?: string
          id?: never
          status?: string
          title: string
          updated_at?: string
          user_id: string
          vote_score?: number
        }
        Update: {
          answer_count?: number
          content?: string
          created_at?: string
          id?: never
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          vote_score?: number
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          notify_on_answer_acceptance: boolean
          notify_on_answers: boolean
          notify_on_follows: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          notify_on_answer_acceptance?: boolean
          notify_on_answers?: boolean
          notify_on_follows?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          notify_on_answer_acceptance?: boolean
          notify_on_answers?: boolean
          notify_on_follows?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: number
          target_id: number
          target_type: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: never
          target_id: number
          target_type: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: never
          target_id?: number
          target_type?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_answer: {
        Args: { p_answer_id: number }
        Returns: {
          accepted: boolean
          content: string
          created_at: string
          id: number
          question_id: number
          updated_at: string
          user_id: string
          vote_score: number
        }
        SetofOptions: {
          from: "*"
          to: "answers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_answer: {
        Args: { p_content: string; p_question_id: number }
        Returns: {
          accepted: boolean
          content: string
          created_at: string
          id: number
          question_id: number
          updated_at: string
          user_id: string
          vote_score: number
        }
        SetofOptions: {
          from: "*"
          to: "answers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_question: {
        Args: { p_content: string; p_title: string }
        Returns: {
          answer_count: number
          content: string
          created_at: string
          id: number
          status: string
          title: string
          updated_at: string
          user_id: string
          vote_score: number
        }
        SetofOptions: {
          from: "*"
          to: "questions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      ensure_my_settings: {
        Args: never
        Returns: {
          created_at: string
          notify_on_answer_acceptance: boolean
          notify_on_answers: boolean
          notify_on_follows: boolean
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      follow_profile: {
        Args: { p_profile_id: string }
        Returns: {
          created_at: string
          follower_id: string
          following_id: string
        }
        SetofOptions: {
          from: "*"
          to: "follows"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_my_notifications_read: { Args: never; Returns: number }
      submit_vote: {
        Args: { p_target_id: number; p_target_type: string; p_value: number }
        Returns: Json
      }
      unfollow_profile: { Args: { p_profile_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  echoes: {
    Tables: {
      concerts: {
        Row: {
          artist: string
          city: string | null
          concert_date: string | null
          created_at: string
          id: number
          is_wishlist: boolean
          notes: string | null
          rating: number | null
          setlist: string | null
          tags: string[]
          updated_at: string
          user_id: string
          venue: string
        }
        Insert: {
          artist: string
          city?: string | null
          concert_date?: string | null
          created_at?: string
          id?: never
          is_wishlist?: boolean
          notes?: string | null
          rating?: number | null
          setlist?: string | null
          tags?: string[]
          updated_at?: string
          user_id: string
          venue: string
        }
        Update: {
          artist?: string
          city?: string | null
          concert_date?: string | null
          created_at?: string
          id?: never
          is_wishlist?: boolean
          notes?: string | null
          rating?: number | null
          setlist?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string
          venue?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_concert: {
        Args: {
          p_artist: string
          p_city?: string
          p_concert_date: string
          p_is_wishlist?: boolean
          p_notes?: string
          p_rating?: number
          p_setlist?: string
          p_tags?: string[]
          p_venue: string
        }
        Returns: {
          artist: string
          city: string | null
          concert_date: string | null
          created_at: string
          id: number
          is_wishlist: boolean
          notes: string | null
          rating: number | null
          setlist: string | null
          tags: string[]
          updated_at: string
          user_id: string
          venue: string
        }
        SetofOptions: {
          from: "*"
          to: "concerts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_concert: {
        Args: { p_concert_id: number }
        Returns: {
          artist: string
          city: string | null
          concert_date: string | null
          created_at: string
          id: number
          is_wishlist: boolean
          notes: string | null
          rating: number | null
          setlist: string | null
          tags: string[]
          updated_at: string
          user_id: string
          venue: string
        }
        SetofOptions: {
          from: "*"
          to: "concerts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_concert: {
        Args: {
          p_artist: string
          p_city?: string
          p_concert_date: string
          p_concert_id: number
          p_is_wishlist?: boolean
          p_notes?: string
          p_rating?: number
          p_setlist?: string
          p_tags?: string[]
          p_venue: string
        }
        Returns: {
          artist: string
          city: string | null
          concert_date: string | null
          created_at: string
          id: number
          is_wishlist: boolean
          notes: string | null
          rating: number | null
          setlist: string | null
          tags: string[]
          updated_at: string
          user_id: string
          venue: string
        }
        SetofOptions: {
          from: "*"
          to: "concerts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  rankex: {
    Tables: {
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      list_bookmarks: {
        Row: {
          created_at: string
          list_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          list_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          list_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_bookmarks_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      list_comments: {
        Row: {
          body: string
          created_at: string
          id: number
          list_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: never
          list_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: never
          list_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_comments_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      list_items: {
        Row: {
          created_at: string
          id: number
          list_id: number
          note: string | null
          position: number
          score: number | null
          tier: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          list_id: number
          note?: string | null
          position: number
          score?: number | null
          tier?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          list_id?: number
          note?: string | null
          position?: number
          score?: number | null
          tier?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      list_likes: {
        Row: {
          created_at: string
          list_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          list_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          list_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_likes_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          created_at: string
          description: string | null
          emoji: string | null
          id: number
          is_public: boolean
          ranking_mode: "ranked" | "scored" | "tiered"
          remixed_from_list_id: number | null
          remixed_from_user_id: string | null
          title: string
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: never
          is_public?: boolean
          ranking_mode?: "ranked" | "scored" | "tiered"
          remixed_from_list_id?: number | null
          remixed_from_user_id?: string | null
          title: string
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: never
          is_public?: boolean
          ranking_mode?: "ranked" | "scored" | "tiered"
          remixed_from_list_id?: number | null
          remixed_from_user_id?: string | null
          title?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_remixed_from_list_id_fkey"
            columns: ["remixed_from_list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      remix_list: { Args: { p_source_list_id: number }; Returns: number }
      reorder_ranked_items: {
        Args: { p_list_id: number; p_ordered_item_ids: number[] }
        Returns: undefined
      }
      reorder_tiered_items: {
        Args: { p_list_id: number; p_ordered_items: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  trackio: {
    Tables: {
      tracker_clicks: {
        Row: {
          clicked_at: string
          id: number
          tracker_id: number
          user_id: string
          xp_awarded: number
        }
        Insert: {
          clicked_at?: string
          id?: never
          tracker_id: number
          user_id: string
          xp_awarded?: number
        }
        Update: {
          clicked_at?: string
          id?: never
          tracker_id?: number
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "tracker_clicks_tracker_id_fkey"
            columns: ["tracker_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
        ]
      }
      trackers: {
        Row: {
          archived_at: string | null
          category: string
          click_count: number
          created_at: string
          id: number
          last_clicked_at: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
          url: string
          user_id: string
          username: string | null
          xp: number
        }
        Insert: {
          archived_at?: string | null
          category: string
          click_count?: number
          created_at?: string
          id?: never
          last_clicked_at?: string | null
          notes?: string | null
          status?: string
          title: string
          updated_at?: string
          url: string
          user_id: string
          username?: string | null
          xp?: number
        }
        Update: {
          archived_at?: string | null
          category?: string
          click_count?: number
          created_at?: string
          id?: never
          last_clicked_at?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_tracker: {
        Args: { p_tracker_id: number }
        Returns: {
          archived_at: string | null
          category: string
          click_count: number
          created_at: string
          id: number
          last_clicked_at: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
          url: string
          user_id: string
          username: string | null
          xp: number
        }
        SetofOptions: {
          from: "*"
          to: "trackers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_tracker: {
        Args: {
          p_category: string
          p_notes?: string
          p_title: string
          p_url: string
          p_username?: string
        }
        Returns: {
          archived_at: string | null
          category: string
          click_count: number
          created_at: string
          id: number
          last_clicked_at: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
          url: string
          user_id: string
          username: string | null
          xp: number
        }
        SetofOptions: {
          from: "*"
          to: "trackers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_tracker_click: {
        Args: { p_tracker_id: number }
        Returns: {
          archived_at: string | null
          category: string
          click_count: number
          created_at: string
          id: number
          last_clicked_at: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
          url: string
          user_id: string
          username: string | null
          xp: number
        }
        SetofOptions: {
          from: "*"
          to: "trackers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_tracker: {
        Args: {
          p_category: string
          p_notes?: string
          p_title: string
          p_tracker_id: number
          p_url: string
          p_username?: string
        }
        Returns: {
          archived_at: string | null
          category: string
          click_count: number
          created_at: string
          id: number
          last_clicked_at: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
          url: string
          user_id: string
          username: string | null
          xp: number
        }
        SetofOptions: {
          from: "*"
          to: "trackers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  core: {
    Enums: {},
  },
  easyqa: {
    Enums: {},
  },
  echoes: {
    Enums: {},
  },
  rankex: {
    Enums: {},
  },
  trackio: {
    Enums: {},
  },
} as const
