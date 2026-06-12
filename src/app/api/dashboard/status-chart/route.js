import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT status as name, COUNT(*) as value FROM transaksi GROUP BY status"
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
