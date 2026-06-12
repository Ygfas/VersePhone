import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  try {
    let sql = "SELECT id_artikel, judul, konten, sumber, TO_BASE64(gambar_artikel) as gambar_base64 FROM artikel";
    const params = [];
    if (q) {
      sql += " WHERE judul LIKE ? OR konten LIKE ?";
      params.push(`%${q}%`, `%${q}%`);
    }
    sql += " ORDER BY id_artikel DESC";
    const [rows] = await pool.query(sql, params);
    return NextResponse.json(
      rows.map((r) => ({
        ...r,
        gambar_artikel: r.gambar_base64
          ? `data:image/jpeg;base64,${r.gambar_base64}`
          : null,
      }))
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const fd = await req.formData();
    const judul = fd.get("judul");
    const konten = fd.get("konten");
    const sumber = fd.get("sumber");
    const file = fd.get("gambar_artikel");
    let buffer = null;
    if (file && file.size > 0) {
      buffer = Buffer.from(await file.arrayBuffer());
    }
    await pool.query(
      "INSERT INTO artikel (judul, konten, gambar_artikel, sumber) VALUES (?, ?, ?, ?)",
      [judul, konten, buffer, sumber]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
