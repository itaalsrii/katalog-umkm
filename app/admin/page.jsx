import { Suspense } from "react";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function DaftarProdukSection() {
  let daftarProduk = null;
  let pesanError = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = "Gagal mengambil data produk: " + error.message;
    } else {
      daftarProduk = data;
    }
  } catch (err) {
    pesanError = "Gagal terhubung ke database: " + err.message;
  }

  if (pesanError) {
    return (
      <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
        <p className="font-semibold">Terjadi kesalahan</p>
        <p className="mt-1 text-sm">{pesanError}</p>
      </div>
    );
  }

  if (!daftarProduk || daftarProduk.length === 0) {
    return <p className="text-teks-lembut">Belum ada produk.</p>;
  }

  return <TabelProduk daftarProduk={daftarProduk} />;
}

export default function HalamanAdmin() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      <Suspense fallback={<p className="text-teks-lembut">Memuat data produk...</p>}>
        <DaftarProdukSection />
      </Suspense>
    </div>
  );
}


