import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // SAMAKAN: Ubah dari 'token' menjadi 'user_session' sesuai API Login
    cookieStore.set({
      name: "user_session",
      value: "",
      httpOnly: true,
      expires: new Date(0), // Menghapus cookie
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
