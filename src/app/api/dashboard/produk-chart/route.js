import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT nama, stok FROM produk ORDER BY id_produk");
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
