import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    let sql = `
      SELECT 
        t.id_transaksi, 
        t.kode_transaksi, 
        t.status,
        p.nama as nama_produk,
        f.first_name, 
        f.user_name, 
        f.alamat, 
        f.no_tlp_or_email,
        pem.waktu_pembayaran,
        TO_BASE64(pem.bukti_pembayaran) as bukti_pembayaran
      FROM transaksi t
      LEFT JOIN produk p ON t.id_produk = p.id_produk
      LEFT JOIN form_transaksi f ON t.id_form = f.id_form
      LEFT JOIN pembayaran pem ON t.id_pembayaran = pem.id_pembayaran
    `;

    const params = [];
    if (q) {
      sql += " WHERE t.kode_transaksi LIKE ? OR p.nama LIKE ? OR f.first_name LIKE ?";
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    
    sql += " ORDER BY t.id_transaksi DESC";

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET Invoice Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}