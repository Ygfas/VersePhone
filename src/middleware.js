import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Ambil path/URL yang sedang dicoba diakses oleh user
  const path = request.nextUrl.pathname;

  // 2. Ambil data sesi (cookie) dari browser
  const sessionCookie = request.cookies.get('user_session')?.value;

  // --- ATURAN UNTUK HALAMAN DASHBOARD (ADMIN) ---
  if (path.startsWith('/dashboard')) {
    // Jika tidak ada cookie sama sekali (belum login) -> Lempar ke login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Baca isi cookie
      const user = JSON.parse(sessionCookie);

      // Jika dia sudah login, TAPI rolenya bukan admin (misal: "ega" sang user) -> Lempar ke home
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Jika cookie rusak/dimanipulasi -> Lempar ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // --- ATURAN UNTUK HALAMAN LOGIN/REGISTER ---
  // Mencegah orang yang SUDAH login untuk kembali halaman login
  if (path.startsWith('/login') || path.startsWith('/register')) {
    if (sessionCookie) {
      try {
        const user = JSON.parse(sessionCookie);
        // Jika dia admin, arahkan ke dashboard. Jika user biasa, arahkan ke home.
        if (user.role === 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (error) {
        // Abaikan jika cookie rusak, biarkan masuk ke halaman login
      }
    }
  }

  // Jika semua pengecekan aman, izinkan user mengakses halaman yang dituju
  return NextResponse.next();
}

// Tentukan rute mana saja yang HARUS melewati "satpam" (middleware) ini
export const config = {
  // matcher: Memfilter agar middleware tidak dijalankan di file gambar, css, atau api internal
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
};