import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase untuk sesi admin menggunakan @supabase/ssr dan cookie.
 * Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 * Hanya boleh dipanggil di server (Server Action, Server Component, atau Route Handler).
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  const rawUrl = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!rawUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY wajib diisi di environment variable."
    );
  }

  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component; abaikan jika middleware/proxy menyegarkan sesi.
        }
      },
    },
  });
}

