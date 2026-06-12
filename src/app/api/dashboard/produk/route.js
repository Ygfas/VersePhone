import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  try {
    // PERBAIKAN: Gunakan backtick untuk kolom berspasi dan alias ("as") ke versi underscore
    let sql = `
      SELECT p.id_produk, p.nama, p.harga, p.stok, p.id_detail_produk,
             TO_BASE64(p.gambar) as gambar,
             d.jenis, d.RAM, d.ROM, d.SOC, d.jaringan, d.warna,
             d.\`main camera\` as main_camera, 
             d.\`selfie camera\` as selfie_camera, 
             d.battery, d.charging, d.os
      FROM produk p
      LEFT JOIN detail_produk d ON p.id_detail_produk = d.id_detail_produk
    `;
    const params = [];
    if (q) {
      sql += " WHERE p.nama LIKE ? OR d.jenis LIKE ?";
      params.push(`%${q}%`, `%${q}%`);
    }
    sql += " ORDER BY p.id_produk DESC";
    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const connection = await pool.getConnection();
  try {
    const fd = await req.formData();
    // ... (pengambilan variabel dari fd.get() tetap sama) ...
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

    let gambarBuffer = null;
    if (gambarFile && gambarFile.size > 0) {
      gambarBuffer = Buffer.from(await gambarFile.arrayBuffer());
    }

    await connection.beginTransaction();

    // PERBAIKAN: Gunakan backtick pada saat INSERT
    const [detailResult] = await connection.query(
      `INSERT INTO detail_produk (jenis, RAM, ROM, SOC, jaringan, warna, \`main camera\`, \`selfie camera\`, battery, charging, os)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [jenis, RAM, ROM, SOC, jaringan, warna, main_camera, selfie_camera, battery, charging, os]
    );
    const id_detail_produk = detailResult.insertId;

    await connection.query(
      "INSERT INTO produk (nama, harga, gambar, id_detail_produk, stok) VALUES (?, ?, ?, ?, ?)",
      [nama, harga, gambarBuffer, id_detail_produk, stok || 0]
    );

    await connection.commit();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    await connection.rollback();
    console.error("POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    connection.release();
  }
}