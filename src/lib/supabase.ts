import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y complétalas."
  );
}

// Nota: usamos el cliente sin genérico <Database> para evitar fricción con las
// restricciones de tipos de @supabase/supabase-js (los inserts colapsarían a
// `never` si el esquema tipado no satisface GenericSchema al 100%). La seguridad
// de tipos se garantiza con los esquemas de Zod + casts en los hooks de query.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 2 },
  },
});
