import { NextResponse } from "next/server";
import pool from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  try {
    let sql = `
      SELECT t.kode_transaksi, t.status,
             pr.nama as nama_produk, pr.harga,
             f.first_name, f.user_name, f.alamat, f.no_tlp_or_email,
             p.waktu_pembayaran
      FROM transaksi t
      LEFT JOIN produk pr ON t.id_produk = pr.id_produk
      LEFT JOIN form_transaksi f ON t.id_form = f.id_form
      LEFT JOIN pembayaran p ON t.id_pembayaran = p.id_pembayaran
    `;
    const params = [];
    const conditions = [];
    if (from) { conditions.push("p.waktu_pembayaran >= ?"); params.push(from); }
    if (to) { conditions.push("p.waktu_pembayaran <= ?"); params.push(to + " 23:59:59"); }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY t.id_transaksi DESC";

    const [rows] = await pool.query(sql, params);

    const wsData = rows.map((r, i) => ({
      No: i + 1,
      "Kode Transaksi": r.kode_transaksi,
      Produk: r.nama_produk,
      "Harga (juta)": r.harga,
      "Nama Pembeli": `${r.first_name || ""} ${r.user_name || ""}`.trim(),
      Alamat: r.alamat,
      Kontak: r.no_tlp_or_email,
      Status: r.status,
      "Waktu Pembayaran": r.waktu_pembayaran
        ? new Date(r.waktu_pembayaran).toLocaleString("id-ID")
        : "-",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    ws["!cols"] = [
      { wch: 4 }, { wch: 16 }, { wch: 12 }, { wch: 10 },
      { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="laporan-penjualan.xlsx"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
