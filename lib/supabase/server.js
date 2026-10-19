import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase di sisi server menggunakan kunci rahasia (SUPABASE_SECRET_KEY).
 * Hanya boleh dipanggil di server (Server Component, Server Action, atau Route Handler).
 */
export function createServerClient() {
  const rawUrl = process.env.SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!rawUrl || !secretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY wajib diisi di environment variable."
    );
  }

  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createSupabaseClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createClient = createServerClient;

