// app/api/iklan/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise"; // Pastikan sudah install: npm install mysql2

export async function GET() {
  try {
    // Sesuaikan dengan konfigurasi database lokal kamu
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "db_versephone",
    });

    const [rows] = await connection.execute("SELECT * FROM iklan_random");
    await connection.end();

    // Konversi BLOB ke base64 agar bisa dirender di HTML
    const data = rows.map((row) => {
      let base64Image = null;
      if (row.gambar) {
        // Mengubah buffer menjadi base64 string
        base64Image = `data:image/jpeg;base64,${Buffer.from(
          row.gambar
        ).toString("base64")}`;
      }
      return {
        ...row,
        gambar: base64Image,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
