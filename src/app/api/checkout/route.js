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

    await connection.beginTransaction();

    // 1. Cek ketersediaan dan kurangi stok Produk
    const [produk] = await connection.query(
      "SELECT stok FROM produk WHERE id_produk = ? FOR UPDATE",
      [id_produk]
    );
    if (produk.length === 0 || produk[0].stok < 1) {
      throw new Error("Stok produk tidak mencukupi.");
    }
    await connection.query(
      "UPDATE produk SET stok = stok - 1 WHERE id_produk = ?",
      [id_produk]
    );

    // 2. Insert ke tabel form
    const [formResult] = await connection.query(
      "INSERT INTO form (first_name, user_name, alamat, no_tlp_or_email) VALUES (?, ?, ?, ?)",
      [first_name, user_name, alamat, no_tlp_or_email]
    );
    const id_form = formResult.insertId;

    // 3. Konversi gambar ke BLOB & Insert ke tabel pembayaran
    let buffer = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }

    // Menggunakan format waktu standar SQL (YYYY-MM-DD HH:mm:ss) agar tidak crash di server MySQL
    const now = new Date();
    const waktu_pembayaran = now.toISOString().slice(0, 19).replace("T", " ");

    const [bayarResult] = await connection.query(
      "INSERT INTO pembayaran (waktu_pembayaran, bukti_pembayaran) VALUES (?, ?)",
      [waktu_pembayaran, buffer]
    );
    const id_pembayaran = bayarResult.insertId;

    // 4. Generate Random Kode dan Insert ke tabel transaksi
    const randomCode = Math.floor(Math.random() * 10000000) + 1;
    const kode_transaksi = `TRX-${randomCode}`;
    const status = "Pending";

    await connection.query(
      "INSERT INTO transaksi (kode_transaksi, status, id_produk, id_form, id_pembayaran) VALUES (?, ?, ?, ?, ?)",
      [kode_transaksi, status, id_produk, id_form, id_pembayaran]
    );

    await connection.commit();
    return NextResponse.json({ success: true, kode_transaksi });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
