import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Ganti 'phones' dengan nama tabel Anda yang sebenarnya
    const [rows] = await pool.query("SELECT * FROM produk");

    // Ini akan mengembalikan data dalam format JSON
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data", details: error.message },
      { status: 500 }
    );
  }
}
