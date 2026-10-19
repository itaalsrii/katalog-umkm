"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk login admin menggunakan email dan password.
 */
export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email")?.toString().trim();
  const password = data?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Email atau password salah." };
      }
      return { error: error.message };
    }
  } catch (err) {
    if (err.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    return { error: "Terjadi kesalahan saat masuk: " + err.message };
  }

  redirect("/admin");
}

/**
 * Server Action untuk keluar (logout) dari sesi admin.
 */
export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch (err) {
    if (err.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Gagal keluar:", err);
  }

  redirect("/admin/login");
}

