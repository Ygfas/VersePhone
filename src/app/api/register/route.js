// app/api/register/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs"; // Ubah ke bcryptjs

export async function POST(request) {
  try {
    const { name, phone, email, password } = await request.json();

    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        { error: "Semua data field wajib diisi!" },
        { status: 400 }
      );
    }

    // Pembersihan email & pembuatan username tanpa spasi/lowercase
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = name.replace(/\s+/g, "").toLowerCase(); // "Yogi Firmansyah" -> "yogifirmansyah"

    // Cek apakah email sudah digunakan
    const [existingUser] = await pool.query(
      "SELECT id_user FROM user WHERE email = ? OR username = ?",
      [cleanEmail, cleanUsername]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email atau Username sudah terdaftar!" },
        { status: 400 }
      );
    }

    // Hashing dengan bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Masukkan ke database
    const [result] = await pool.query(
      `INSERT INTO user (username, password, no_hp, email, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [cleanUsername, hashedPassword, phone, cleanEmail, "user"]
    );

    return NextResponse.json(
      { message: "User berhasil didaftarkan!", username: cleanUsername },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data ke database", details: error.message },
      { status: 500 }
    );
  }
}
