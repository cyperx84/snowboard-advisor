import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      recommendations: {
        Row: {
          id: string;
          slug: string;
          inputs: Record<string, unknown>;
          boards: Record<string, unknown>[];
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          inputs: Record<string, unknown>;
          boards: Record<string, unknown>[];
          created_at?: string;
        };
      };
    };
  };
};
