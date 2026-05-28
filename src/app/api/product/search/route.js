// app/api/product/search/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Ambil id, nama (untuk slug), dan jenis (untuk dropdown) dengan LEFT JOIN
    const [rows] = await pool.query(
      `SELECT p.id_produk, p.nama, d.jenis 
       FROM produk p
       LEFT JOIN detail_produk d ON p.id_detail_produk = d.id_detail_produk`
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data search", details: error.message },
      { status: 500 }
    );
  }
}
