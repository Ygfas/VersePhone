import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const fd = await req.formData();
    const judul = fd.get("judul");
    const konten = fd.get("konten");
    const sumber = fd.get("sumber");
    const file = fd.get("gambar_artikel");
    if (file && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      await pool.query(
        "UPDATE artikel SET judul=?, konten=?, sumber=?, gambar_artikel=? WHERE id_artikel=?",
        [judul, konten, sumber, buf, id]
      );
    } else {
      await pool.query(
        "UPDATE artikel SET judul=?, konten=?, sumber=? WHERE id_artikel=?",
        [judul, konten, sumber, id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await pool.query("DELETE FROM artikel WHERE id_artikel = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
