import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [[t], [p], [u], [a]] = await Promise.all([
      pool.query("SELECT COUNT(*) as c FROM transaksi"),
      pool.query("SELECT COUNT(*) as c FROM produk"),
      pool.query("SELECT COUNT(*) as c FROM `user`"),
      pool.query("SELECT COUNT(*) as c FROM artikel"),
    ]);
    return NextResponse.json({
      totalTransaksi: t[0].c,
      totalProduk: p[0].c,
      totalUser: u[0].c,
      totalArtikel: a[0].c,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
