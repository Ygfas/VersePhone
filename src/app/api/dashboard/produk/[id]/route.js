import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req, { params }) {
  const { id } = await params;
  const connection = await pool.getConnection();
  try {
    const fd = await req.formData();
    const nama = fd.get("nama");
    const harga = fd.get("harga");
    const stok = fd.get("stok");
    const jenis = fd.get("jenis");
    const RAM = fd.get("RAM");
    const ROM = fd.get("ROM");
    const SOC = fd.get("SOC");
    const jaringan = fd.get("jaringan");
    const warna = fd.get("warna");
    const main_camera = fd.get("main_camera");
    const selfie_camera = fd.get("selfie_camera");
    const battery = fd.get("battery");
    const charging = fd.get("charging");
    const os = fd.get("os");
    const gambarFile = fd.get("gambar");

    await connection.beginTransaction();

    const [p] = await connection.query(
      "SELECT id_detail_produk FROM produk WHERE id_produk = ?", [id]
    );
    if (p.length === 0) throw new Error("Produk tidak ditemukan");

   // PERBAIKAN: Gunakan backtick pada saat UPDATE
    await connection.query(
      `UPDATE detail_produk SET jenis=?, RAM=?, ROM=?, SOC=?, jaringan=?, warna=?,
       \`main camera\`=?, \`selfie camera\`=?, battery=?, charging=?, os=?
       WHERE id_detail_produk = ?`,
      [jenis, RAM, ROM, SOC, jaringan, warna, main_camera, selfie_camera, battery, charging, os, p[0].id_detail_produk]
    );

    if (gambarFile && gambarFile.size > 0) {
      const buf = Buffer.from(await gambarFile.arrayBuffer());
      await connection.query(
        "UPDATE produk SET nama=?, harga=?, stok=?, gambar=? WHERE id_produk=?",
        [nama, harga, stok, buf, id]
      );
    } else {
      await connection.query(
        "UPDATE produk SET nama=?, harga=?, stok=? WHERE id_produk=?",
        [nama, harga, stok, id]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (e) {
    await connection.rollback();
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [p] = await connection.query(
      "SELECT id_detail_produk FROM produk WHERE id_produk = ?", [id]
    );
    await connection.query("DELETE FROM produk WHERE id_produk = ?", [id]);
    if (p.length > 0 && p[0].id_detail_produk) {
      await connection.query("DELETE FROM detail_produk WHERE id_detail_produk = ?", [p[0].id_detail_produk]);
    }
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (e) {
    await connection.rollback();
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
