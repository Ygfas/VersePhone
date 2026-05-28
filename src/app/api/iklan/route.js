// app/api/artikel/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM iklan_random");

   
    const formattedRows = rows.map((row) => ({
      ...row,
      gambar_artikel: row.gambar_artikel
        ? `data:image/jpeg;base64,${Buffer.from(row.gambar_artikel).toString(
            "base64"
          )}`
        : null,
    }));

    return NextResponse.json(formattedRows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
