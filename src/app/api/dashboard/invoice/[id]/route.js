import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { status } = await req.json();
  try {
    await pool.query("UPDATE transaksi SET status = ? WHERE id_transaksi = ?", [status, id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      "SELECT id_form, id_pembayaran FROM transaksi WHERE id_transaksi = ?",
      [id]
    );
    if (rows.length === 0) throw new Error("Not found");
    const { id_form, id_pembayaran } = rows[0];
    await connection.query("DELETE FROM transaksi WHERE id_transaksi = ?", [id]);
    if (id_form) await connection.query("DELETE FROM form_transaksi WHERE id_form = ?", [id_form]);
    if (id_pembayaran) await connection.query("DELETE FROM pembayaran WHERE id_pembayaran = ?", [id_pembayaran]);
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (e) {
    await connection.rollback();
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
