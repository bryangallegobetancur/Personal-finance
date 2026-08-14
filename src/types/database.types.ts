// Tipos generados a mano alineados con el esquema SQL (Supabase).
// Si usas `supabase gen types typescript`, puedes reemplazar este archivo.

export type CategoryType = "ingreso" | "gasto";
export type TransactionType = "ingreso" | "gasto";
export type BudgetPeriodicity = "mensual" | "anual";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  date: string; // ISO date (YYYY-MM-DD)
  description: string;
  category_id: string | null;
  type: TransactionType;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  amount: number;
  periodicity: BudgetPeriodicity;
  category_id: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  budget_id: string;
  transaction_id: string | null;
  amount_exceeded: number;
  created_at: string;
}

export interface DashboardSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  income_vs_expense: { label: string; ingresos: number; gastos: number }[];
  by_category: { label: string; ingresos: number; gastos: number }[];
}

// ---- Tipado de Base de Datos para el cliente tipado de Supabase ----------
// Estructura completa requerida por @supabase/supabase-js v2.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        // user_id se setea desde el cliente en el insert
        Insert: Omit<Category, "id" | "created_at">;
        Update: Partial<Omit<Category, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at">;
        Update: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      budgets: {
        Row: Budget;
        Insert: Omit<Budget, "id" | "created_at" | "start_date" | "end_date"> & {
          start_date?: string | null;
          end_date?: string | null;
        };
        Update: Partial<Omit<Budget, "id" | "user_id" | "created_at">> & {
          start_date?: string | null;
          end_date?: string | null;
        };
        Relationships: [];
      };
      alerts_history: {
        Row: Alert;
        Insert: Omit<Alert, "id" | "created_at">;
        Update: Partial<Alert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
