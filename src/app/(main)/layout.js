import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/main/navbar";
import { InteractiveFooter } from "@/components/main/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | VersePhone",
    default: "VersePhone",
  },
  description: "The OFficial Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 dark:bg-neutral-900 min-h-screen flex flex-col`}
      >
        <ScrollProgress className="fixed top-0 left-0 right-0 z-[5000]" />
        <Navbar />

        {/* Berikan min-h agar layout tidak pecah jika konten sedikit */}
        <main className="flex-grow">{children}</main>

        <InteractiveFooter />

        {/* Progressive Blur sebagai overlay global di bagian bawah */}
        <ProgressiveBlur height="10vh" position="bottom"  />
      </body>
    </html>
  );
}
