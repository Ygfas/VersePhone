// app/api/product/[slug]/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, { params }) {
  try {
    // Membuka unwrap dynamic API route params (Next.js 15)
    const { slug } = await params;

    // Query mengambil data produk gabung dengan detail spesifikasinya
    const [rows] = await pool.query(
      `SELECT p.*, d.* FROM produk p 
       LEFT JOIN detail_produk d ON p.id_detail_produk = d.id_detail_produk 
       WHERE p.nama = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const data = rows[0];

    // Mapping data ke format objek UI VersePhone
    const product = {
      id: data.id_produk,
      title: data.jenis || data.nama,
      brand: data.nama,
      price: parseFloat(data.harga) * 1000000,
      originalPrice: parseFloat(data.harga) * 1000000,
      stock: data.stok !== undefined && data.stok !== null ? data.stok : 0, // Mengambil data kolom stok secara presisi
      image: data.gambar
        ? `data:image/jpeg;base64,${Buffer.from(data.gambar).toString(
            "base64"
          )}`
        : "/placeholder.png",
      colors: data.warna ? data.warna.split(",").map((c) => c.trim()) : [],
      storage: data.ROM ? [data.ROM] : [],
      specs: {
        ...(data.jenis && { "Model/Jenis": data.jenis }),
        ...(data.RAM && { RAM: `${data.RAM} GB` }),
        ...(data.ROM && { "Internal Storage (ROM)": data.ROM }),
        ...(data.SOC && { "Processor (SoC)": data.SOC }),
        ...(data.jaringan && { Jaringan: data.jaringan }),
        ...(data.warna && { "Pilihan Warna": data.warna }),
        ...(data.main_camera && { "Kamera Belakang": data.main_camera }),
        ...(data.selfie_camera && { "Kamera Depan": data.selfie_camera }),
        ...(data.battery && { "Kapasitas Baterai": data.battery }),
        ...(data.charging && { "Daya Charging": data.charging }),
        ...(data.os && { "Sistem Operasi": data.os }),
      },
    };

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil detail data", details: error.message },
      { status: 500 }
    );
  }
}
