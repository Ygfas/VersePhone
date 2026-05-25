import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Menggunakan koneksi pool milikmu

export async function POST(request) {
  try {
    const { emailOrUsername, password } = await request.json();

    // Query ke tabel 'user' menggunakan pool yang sudah kamu buat
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE (email = ? OR username = ?) AND password = ?",
      [emailOrUsername, emailOrUsername, password]
    );

    // Jika user tidak ditemukan atau password salah
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Email/Username atau password salah!" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Buat response sukses dan kirim role ke frontend
    const response = NextResponse.json(
      { message: "Login berhasil", role: user.role },
      { status: 200 }
    );

    // Set Cookie agar halaman utama ('/') tahu bahwa user sudah login (logged)
    response.cookies.set({
      name: "user_session",
      value: JSON.stringify({
        id: user.id_user,
        role: user.role,
        username: user.username,
      }),
      httpOnly: true, // Aman dari pembacaan script Client-Side (XSS)
      path: "/",
      maxAge: 60 * 60 * 24, // Berlaku selama 1 hari
    });

    return response;
  } catch (error) {
    // Mengembalikan pesan error jika terjadi kegagalan database/server
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server", details: error.message },
      { status: 500 }
    );
  }
}
