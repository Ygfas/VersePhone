import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/main/navbar";
import { InteractiveFooter } from "@/components/main/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cookies } from "next/headers"; // 1. Import cookies


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: { template: "%s | VersePhone", default: "VersePhone" },
  description: "",
};


export default async function RootLayout({ children }) {
  // 2. Ambil data session dari cookie di sisi server
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session")?.value;
  const user = sessionCookie ? JSON.parse(sessionCookie) : null;

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 dark:bg-neutral-900 min-h-screen flex flex-col`}
      >
        <ScrollProgress className="fixed top-0 left-0 right-0 z-[5000]" />

        {/* 3. Oper data user ke komponen Navbar */}
        <Navbar user={user} />

            <main className="flex-grow">
                {children}
            </main>
        <InteractiveFooter />
        <ProgressiveBlur height="10vh" position="bottom" />
      </body>
    </html>
  );
}
