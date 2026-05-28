// app/api/product/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Lakukan LEFT JOIN untuk mengambil kolom 'jenis' dari tabel detail_produk
    const [rows] = await pool.query(`
      SELECT p.*, d.jenis 
      FROM produk p
      LEFT JOIN detail_produk d ON p.id_detail_produk = d.id_detail_produk
    `);

    // Mapping aman untuk mengonversi BLOB gambar ke Base64 string
    const formattedRows = rows.map((item) => ({
      ...item,
      gambar: item.gambar ? Buffer.from(item.gambar).toString("base64") : null,
    }));

    return NextResponse.json(formattedRows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data produk", details: error.message },
      { status: 500 }
    );
  }
}
