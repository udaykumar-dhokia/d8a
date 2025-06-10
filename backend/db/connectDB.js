import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase credentials: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env"
  );
}

let supabase;

try {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  throw error;
}

export default supabase;