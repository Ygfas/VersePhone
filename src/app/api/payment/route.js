import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  const connection = await pool.getConnection();

  try {
    const formData = await req.formData();

    const id_produk = formData.get("id_produk");
    const first_name = formData.get("first_name");
    const user_name = formData.get("user_name");
    const alamat = formData.get("alamat");
    const no_tlp_or_email = formData.get("no_tlp_or_email");
    const file = formData.get("bukti_pembayaran");

    // Validasi input wajib
    if (
      !id_produk ||
      !first_name ||
      !user_name ||
      !alamat ||
      !no_tlp_or_email
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // ── 1. Cek stok & kurangi ─────────────────────────────────────────────────
    const [produk] = await connection.query(
      "SELECT stok FROM produk WHERE id_produk = ? FOR UPDATE",
      [id_produk]
    );

    if (produk.length === 0) {
      throw new Error("Produk tidak ditemukan.");
    }
    if (produk[0].stok < 1) {
      throw new Error("Stok produk sudah habis.");
    }

    await connection.query(
      "UPDATE produk SET stok = stok - 1 WHERE id_produk = ?",
      [id_produk]
    );

    // ── 2. Insert ke tabel `form` ─────────────────────────────────────────────
    const [formResult] = await connection.query(
      "INSERT INTO form_transaksi (first_name, user_name, alamat, no_tlp_or_email) VALUES (?, ?, ?, ?)",
      [first_name, user_name, alamat, no_tlp_or_email]
    );
    const id_form = formResult.insertId;

    // ── 3. Konversi bukti ke BLOB & catat waktu ───────────────────────────────
    let buffer = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }

    // Format waktu SQL: YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const waktu_pembayaran = now.toISOString().slice(0, 19).replace("T", " ");

    const [bayarResult] = await connection.query(
      "INSERT INTO pembayaran (waktu_pembayaran, bukti_pembayaran) VALUES (?, ?)",
      [waktu_pembayaran, buffer]
    );
    const id_pembayaran = bayarResult.insertId;

    // ── 4. Generate kode transaksi & insert ke `transaksi` ────────────────────
    const randomCode = Math.floor(Math.random() * 10_000_000) + 1;
    const kode_transaksi = `TRX-${String(randomCode).padStart(7, "0")}`;
    const status = "Pending";

    await connection.query(
      `INSERT INTO transaksi (kode_transaksi, status, id_produk, id_form, id_pembayaran)
       VALUES (?, ?, ?, ?, ?)`,
      [kode_transaksi, status, id_produk, id_form, id_pembayaran]
    );

    await connection.commit();

    return NextResponse.json(
      { success: true, kode_transaksi },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();
    console.error("[POST /api/payment] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
