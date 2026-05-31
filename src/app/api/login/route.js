// app/api/login/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs"; // Ubah ke bcryptjs

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

    // Deteksi jika password merupakan Bcrypt hash (panjangnya biasanya 60 karakter & diawali $2)
    const isBcryptHash =
      user.password.startsWith("$2") && user.password.length === 60;

    if (isBcryptHash) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Fallback untuk akun lama di DB (aaa / bbb) yang pakai plain text
      isPasswordValid = password === user.password;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        role: user.role,
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
