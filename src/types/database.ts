export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          product_id: number
          quantity: number
          size: string
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          quantity?: number
          size?: string
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          status: string
          total: number
          user_id: string | null
          delivery_address: string | null
          delivery_city: string | null
          delivery_postal_code: string | null
          delivery_province: string | null
          delivery_country: string | null
          delivery_phone: string | null
          delivery_instructions: string | null
          customer_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string
          total?: number
          user_id?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_postal_code?: string | null
          delivery_province?: string | null
          delivery_country?: string | null
          delivery_phone?: string | null
          delivery_instructions?: string | null
          customer_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string
          total?: number
          user_id?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_postal_code?: string | null
          delivery_province?: string | null
          delivery_country?: string | null
          delivery_phone?: string | null
          delivery_instructions?: string | null
          customer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: number
          image: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          group: string
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
          stripe_customer_id: string | null
          phone: string | null
          default_address: string | null
          default_city: string | null
          default_postal_code: string | null
          default_province: string | null
          default_country: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          group?: string
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
          stripe_customer_id?: string | null
          phone?: string | null
          default_address?: string | null
          default_city?: string | null
          default_postal_code?: string | null
          default_province?: string | null
          default_country?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          group?: string
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
          stripe_customer_id?: string | null
          phone?: string | null
          default_address?: string | null
          default_city?: string | null
          default_postal_code?: string | null
          default_province?: string | null
          default_country?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Additional types for convenience
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Profile = Tables<'profiles'> 