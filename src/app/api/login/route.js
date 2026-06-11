// app/api/login/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers"; // Ditambahkan untuk mengatur session cookie

export async function POST(request) {
  try {
    const { emailOrUsername, password } = await request.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { message: "Email/Username dan password wajib diisi!" },
        { status: 400 }
      );
    }

    const identifier = emailOrUsername.trim().toLowerCase();

    // Cari berdasarkan email ATAU username
    const [users] = await pool.query(
      "SELECT * FROM user WHERE email = ? OR username = ?",
      [identifier, identifier]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Email atau Username tidak ditemukan." },
        { status: 401 }
      );
    }

    const user = users[0];
    let isPasswordValid = false;

    // Deteksi jika password merupakan Bcrypt hash
    const isBcryptHash =
      user.password.startsWith("$2") && user.password.length === 60;

    if (isBcryptHash) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Fallback untuk akun lama di DB yang pakai plain text
      isPasswordValid = password === user.password;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // --- PROSES PEMBUATAN SESSION ---
    // Menyusun data user yang aman untuk disimpan di cookie (Hindari menyimpan password!)
    const userData = {
      id_user: user.id_user, // Sesuaikan dengan nama kolom primary key di tabel user Anda
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Set cookie secara HTTP-Only agar aman dari XSS dan bisa dibaca oleh server untuk validasi Payment
    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(userData), {
      httpOnly: true, // Tidak bisa dibaca lewat javascript client-side (Aman!)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // Berlaku selama 1 hari (dalam detik)
      path: "/",
    });

    return NextResponse.json(
      {
        role: user.role,
        user: userData, // Mengembalikan data user ke client untuk update state UI profil
        message: "Login berhasil!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
