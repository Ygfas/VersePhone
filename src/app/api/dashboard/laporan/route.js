import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  try {
    let sql = `
      SELECT t.id_transaksi, t.kode_transaksi, t.status,
             pr.nama as nama_produk, pr.harga,
             f.first_name, f.user_name, f.alamat,
             p.waktu_pembayaran
      FROM transaksi t
      LEFT JOIN produk pr ON t.id_produk = pr.id_produk
      LEFT JOIN form_transaksi f ON t.id_form = f.id_form
      LEFT JOIN pembayaran p ON t.id_pembayaran = p.id_pembayaran
    `;
    const params = [];
    const conditions = [];
    if (from) { conditions.push("p.waktu_pembayaran >= ?"); params.push(from); }
    if (to) { conditions.push("p.waktu_pembayaran <= ?"); params.push(to + " 23:59:59"); }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY t.id_transaksi DESC";
    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
