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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ad_packages: {
        Row: {
          created_at: string
          delivery_days: number
          description: string | null
          id: string
          includes: Json | null
          is_active: boolean
          price: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_days?: number
          description?: string | null
          id?: string
          includes?: Json | null
          is_active?: boolean
          price: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_days?: number
          description?: string | null
          id?: string
          includes?: Json | null
          is_active?: boolean
          price?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          duration_ms: number | null
          endpoint: string | null
          error_message: string | null
          id: string
          platform: string | null
          request_data: Json | null
          response_data: Json | null
          status_code: number | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          duration_ms?: number | null
          endpoint?: string | null
          error_message?: string | null
          id?: string
          platform?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          duration_ms?: number | null
          endpoint?: string | null
          error_message?: string | null
          id?: string
          platform?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number | null
        }
        Relationships: []
      }
      analytics_audiences: {
        Row: {
          age18_24: number | null
          age25_34: number | null
          age35_44: number | null
          age45plus: number | null
          created_at: string | null
          female: number | null
          id: string
          locations: string[] | null
          male: number | null
          profile_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age18_24?: number | null
          age25_34?: number | null
          age35_44?: number | null
          age45plus?: number | null
          created_at?: string | null
          female?: number | null
          id?: string
          locations?: string[] | null
          male?: number | null
          profile_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age18_24?: number | null
          age25_34?: number | null
          age35_44?: number | null
          age45plus?: number | null
          created_at?: string | null
          female?: number | null
          id?: string
          locations?: string[] | null
          male?: number | null
          profile_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_audiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "analytics_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_campaigns: {
        Row: {
          created_at: string | null
          engagement_rate: number | null
          id: string
          name: string
          profile_id: string | null
          reach: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          name: string
          profile_id?: string | null
          reach?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          name?: string
          profile_id?: string | null
          reach?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_campaigns_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "analytics_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_profiles: {
        Row: {
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audience_demographics: {
        Row: {
          age_range: string | null
          country_code: string | null
          created_at: string
          date: string
          gender: string | null
          id: string
          percentage: number | null
          social_account_id: string
        }
        Insert: {
          age_range?: string | null
          country_code?: string | null
          created_at?: string
          date: string
          gender?: string | null
          id?: string
          percentage?: number | null
          social_account_id: string
        }
        Update: {
          age_range?: string | null
          country_code?: string | null
          created_at?: string
          date?: string
          gender?: string | null
          id?: string
          percentage?: number | null
          social_account_id?: string
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number
          blocked_until: string | null
          email: string | null
          first_attempt: string
          id: string
          ip_address: unknown
          last_attempt: string
        }
        Insert: {
          attempt_count?: number
          blocked_until?: string | null
          email?: string | null
          first_attempt?: string
          id?: string
          ip_address: unknown
          last_attempt?: string
        }
        Update: {
          attempt_count?: number
          blocked_until?: string | null
          email?: string | null
          first_attempt?: string
          id?: string
          ip_address?: unknown
          last_attempt?: string
        }
        Relationships: []
      }
      compromised_passwords: {
        Row: {
          leaked_password: string
        }
        Insert: {
          leaked_password: string
        }
        Update: {
          leaked_password?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          category: string | null
          collaboration_types: string[] | null
          created_at: string
          display_name: string | null
          facebook_handle: string | null
          id: string
          instagram_handle: string | null
          languages: string[] | null
          location: string | null
          niche: string | null
          phone: string | null
          rate_per_post: number | null
          rate_per_story: number | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          website: string | null
          youtube_handle: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          collaboration_types?: string[] | null
          created_at?: string
          display_name?: string | null
          facebook_handle?: string | null
          id?: string
          instagram_handle?: string | null
          languages?: string[] | null
          location?: string | null
          niche?: string | null
          phone?: string | null
          rate_per_post?: number | null
          rate_per_story?: number | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          youtube_handle?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          collaboration_types?: string[] | null
          created_at?: string
          display_name?: string | null
          facebook_handle?: string | null
          id?: string
          instagram_handle?: string | null
          languages?: string[] | null
          location?: string | null
          niche?: string | null
          phone?: string | null
          rate_per_post?: number | null
          rate_per_story?: number | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          youtube_handle?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shared_reports: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          public_url: string
          report_data: Json
          user_id: string
          views_count: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          public_url: string
          report_data: Json
          user_id: string
          views_count?: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          public_url?: string
          report_data?: Json
          user_id?: string
          views_count?: number
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token_enc: string
          account_ref: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          refresh_token_enc: string | null
          scope: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token_enc: string
          account_ref?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token_enc?: string | null
          scope?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token_enc?: string
          account_ref?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token_enc?: string | null
          scope?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_metrics: {
        Row: {
          comments_avg: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          impressions_avg: number | null
          likes_avg: number | null
          posts_count: number | null
          profile_views: number | null
          reach_avg: number | null
          shares_avg: number | null
          social_account_id: string
          views_avg: number | null
          website_clicks: number | null
        }
        Insert: {
          comments_avg?: number | null
          created_at?: string
          date: string
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          impressions_avg?: number | null
          likes_avg?: number | null
          posts_count?: number | null
          profile_views?: number | null
          reach_avg?: number | null
          shares_avg?: number | null
          social_account_id: string
          views_avg?: number | null
          website_clicks?: number | null
        }
        Update: {
          comments_avg?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          impressions_avg?: number | null
          likes_avg?: number | null
          posts_count?: number | null
          profile_views?: number | null
          reach_avg?: number | null
          shares_avg?: number | null
          social_account_id?: string
          views_avg?: number | null
          website_clicks?: number | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          caption: string | null
          comments_count: number | null
          created_at: string
          engagement_rate: number | null
          id: string
          likes_count: number | null
          media_type: string | null
          media_url: string | null
          post_id: string
          posted_at: string | null
          shares_count: number | null
          social_account_id: string
          thumbnail_url: string | null
          views_count: number | null
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          created_at?: string
          engagement_rate?: number | null
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          post_id: string
          posted_at?: string | null
          shares_count?: number | null
          social_account_id: string
          thumbnail_url?: string | null
          views_count?: number | null
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          created_at?: string
          engagement_rate?: number | null
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          post_id?: string
          posted_at?: string | null
          shares_count?: number | null
          social_account_id?: string
          thumbnail_url?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      test_metrics: {
        Row: {
          comments_avg: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          followers_count: number | null
          following_count: number | null
          growth_7d: Json | null
          id: string
          impressions_avg: number | null
          likes_avg: number | null
          posts_count: number | null
          profile_views: number | null
          reach_avg: number | null
          shares_avg: number | null
          test_profile_id: string
          top_post: Json | null
          views_avg: number | null
          website_clicks: number | null
        }
        Insert: {
          comments_avg?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          growth_7d?: Json | null
          id?: string
          impressions_avg?: number | null
          likes_avg?: number | null
          posts_count?: number | null
          profile_views?: number | null
          reach_avg?: number | null
          shares_avg?: number | null
          test_profile_id: string
          top_post?: Json | null
          views_avg?: number | null
          website_clicks?: number | null
        }
        Update: {
          comments_avg?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          growth_7d?: Json | null
          id?: string
          impressions_avg?: number | null
          likes_avg?: number | null
          posts_count?: number | null
          profile_views?: number | null
          reach_avg?: number | null
          shares_avg?: number | null
          test_profile_id?: string
          top_post?: Json | null
          views_avg?: number | null
          website_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_metrics_test_profile_id_fkey"
            columns: ["test_profile_id"]
            isOneToOne: false
            referencedRelation: "test_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_profiles: {
        Row: {
          access_token: string | null
          admin_user_id: string
          bio: string | null
          created_at: string
          display_name: string | null
          engagement_rate: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          last_sync_at: string | null
          platform: string
          posts_count: number | null
          profile_picture_url: string | null
          refresh_token: string | null
          updated_at: string
          username: string
        }
        Insert: {
          access_token?: string | null
          admin_user_id: string
          bio?: string | null
          created_at?: string
          display_name?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_sync_at?: string | null
          platform: string
          posts_count?: number | null
          profile_picture_url?: string | null
          refresh_token?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          access_token?: string | null
          admin_user_id?: string
          bio?: string | null
          created_at?: string
          display_name?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_sync_at?: string | null
          platform?: string
          posts_count?: number | null
          profile_picture_url?: string | null
          refresh_token?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_activity: string
          session_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_auth_rate_limit: {
        Args: { p_email?: string; p_ip_address: unknown }
        Returns: boolean
      }
      check_password_complexity: {
        Args: { password: string }
        Returns: boolean
      }
      decrypt_token: {
        Args: { encrypted_token: string }
        Returns: string
      }
      detect_suspicious_activity: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      encrypt_token: {
        Args: { token_value: string }
        Returns: string
      }
      generate_report_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_decrypted_token: {
        Args: { p_provider: string; p_user_id: string }
        Returns: {
          access_token: string
          account_ref: string
          refresh_token: string
        }[]
      }
      get_request_ip: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_social_account_secure: {
        Args: { p_account_id: string }
        Returns: {
          account_id: string
          display_name: string
          id: string
          is_connected: boolean
          last_sync_at: string
          platform: string
          profile_picture_url: string
          username: string
        }[]
      }
      get_social_account_tokens: {
        Args: { account_id: string }
        Returns: {
          access_token: string
          refresh_token: string
        }[]
      }
      get_user_social_accounts_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_id: string
          created_at: string
          display_name: string
          id: string
          is_connected: boolean
          last_sync_at: string
          platform: string
          profile_picture_url: string
          updated_at: string
          username: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_auth_event: {
        Args:
          | { p_details?: Json; p_event_type: string }
          | {
              p_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_user_agent?: string
            }
        Returns: undefined
      }
      log_security_event: {
        Args:
          | {
              p_action: string
              p_details?: Json
              p_ip_address?: unknown
              p_record_id?: string
              p_table_name?: string
              p_user_agent?: string
            }
          | {
              p_action: string
              p_details?: Json
              p_record_id?: string
              p_table_name?: string
            }
        Returns: undefined
      }
      log_shared_report_access: {
        Args: { access_ip?: unknown; report_id: string }
        Returns: undefined
      }
      manage_user_session: {
        Args: {
          p_ip_address?: unknown
          p_session_id: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      select_set_config: {
        Args: { p_key: string; p_value: string }
        Returns: undefined
      }
      upsert_social_account_secure: {
        Args: {
          p_access_token: string
          p_account_ref: string
          p_expires_at: string
          p_provider: string
          p_refresh_token: string
          p_user_id: string
        }
        Returns: undefined
      }
      validate_password: {
        Args:
          | { email: string; password: string }
          | {
              password: string
              previous_passwords?: string[]
              username?: string
            }
        Returns: boolean
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
