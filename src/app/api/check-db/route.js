import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db";

export async function GET() {
  const isConnected = await testConnection();

  if (isConnected) {
    return NextResponse.json(
      { message: "Koneksi database aktif!" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Koneksi database gagal!" },
      { status: 500 }
    );
  }
}
