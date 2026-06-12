import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT t.id_transaksi, t.kode_transaksi, t.status,
             pr.nama as nama,
             p.waktu_pembayaran
      FROM transaksi t
      LEFT JOIN produk pr ON t.id_produk = pr.id_produk
      LEFT JOIN pembayaran p ON t.id_pembayaran = p.id_pembayaran
      ORDER BY t.id_transaksi DESC
      LIMIT 20
    `);
    const formatted = rows.map((r) => ({
      ...r,
      waktu_pembayaran: r.waktu_pembayaran
        ? new Date(r.waktu_pembayaran).toLocaleString("id-ID")
        : "-",
    }));
    return NextResponse.json(formatted);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
