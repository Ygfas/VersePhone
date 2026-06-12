import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(p.waktu_pembayaran, '%Y-%m-%d') as label, COUNT(*) as total
      FROM transaksi t
      JOIN pembayaran p ON t.id_pembayaran = p.id_pembayaran
      WHERE p.waktu_pembayaran >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY label
      ORDER BY label ASC
    `);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
