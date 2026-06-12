import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session");

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Mengubah string JSON di cookie kembali menjadi objek
    const userData = JSON.parse(session.value);
    
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}