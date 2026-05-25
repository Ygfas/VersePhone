"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X, DoorOpenIcon, ArrowRight, User, LogOut, ShieldCheck, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavSearch } from "./floating-search";
import { AnimatedThemeToggler } from "./animated-theme-toggler";

const products = [
  { name: "Y05", image: "/test1.png", status: "baru" },
  { name: "X300 Pro", image: "/test2.png", status: "baru" },
  { name: "X300", image: "/4e0e2a2fdc70a2deea769ed379b90c44.png", status: "baru" },
  { name: "Y21d", image: "/test1.png", status: "baru" },
  { name: "V60 Lite 5G", image: "/test1.png", status: "baru" },
  { name: "V60 Lite", image: "/test1.png", status: "baru" },
  { name: "V60", image: "/test1.png", status: "baru" },
];

export const FloatingNav = ({ navItems, user: serverUser, className }) => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Ambil data user ke dalam state lokal agar bisa berubah instan saat login/logout
  const [user, setUser] = useState(serverUser);

  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const router = useRouter();

  // Sinkronisasikan state lokal jika data user dari Server Component berubah
  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      if (!isAnimatingRef.current) {
        setIsProductOpen(true);
      }
    }, 60);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsProductOpen(false);
    }, 180);
  }, []);

  // PERBAIKAN LOGIKA LOGOUT
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        // 1. Tutup semua menu modal/dropdown yang terbuka
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);

        // 2. Kosongkan state user secara instan di client side
        setUser(null);

        // 3. Refresh router agar server menghapus data layout lama
        router.refresh();

        // 4. Paksa hard reload kecil atau arahkan ke home agar session benar-benar bersih
        window.location.href = "/";
      } else {
        alert("Gagal logout, respons server bermasalah.");
      }
    } catch (error) {
      console.error("Error logout:", error);
      alert("Terjadi kesalahan jaringan saat logout.");
    }
  };
  return (
    <>
      {/* Product Dropdown (Desktop Only) */}
      <AnimatePresence onExitComplete={() => { isAnimatingRef.current = false; }}>
        {isProductOpen && (
          <motion.div
            key="product-dropdown"
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 0px)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 0px)" }}
            transition={{
              clipPath: { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
              opacity: { duration: 0.12, ease: "easeOut" },
            }}
            onAnimationStart={() => { isAnimatingRef.current = true; }}
            onAnimationComplete={() => { isAnimatingRef.current = false; }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed top-0 left-0 w-full z-[40] hidden sm:block"
          >
            <div className="w-full bg-white border-b border-neutral-100 shadow-lg shadow-black/[0.06] dark:bg-black dark:border-white/10">
              <div className="max-w-[1400px] mx-auto px-4 pt-26 pb-6">
                <div className="flex gap-12 xl:gap-28 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {products.map((hp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, type: "spring", stiffness: 500, damping: 30 }}
                      className="flex flex-col items-center group/card cursor-pointer flex-shrink-0 w-[calc((100%-40*1rem)/6)]"
                    >
                      <div className="w-full aspect-[3/4] rounded-[12px] bg-white flex items-center justify-center p-8 transition-all duration-500 group-hover/card:scale-[1.04] group-hover/card:bg-neutral-100 dark:bg-black dark:group-hover/card:bg-neutral-900">
                        <img src={hp.image} alt={hp.name} className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]" />
                      </div>
                      <div className="mt-4 text-center flex flex-col items-center gap-1.5">
                        <span className="text-[15px] font-semibold text-neutral-900 dark:text-white whitespace-nowrap">{hp.name}</span>
                        {hp.status && (
                          <span className="text-[10px] text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">{hp.status}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-8 py-5 border-t border-neutral-100 dark:border-white/10">
                <Link href={'/products'} asChild>
                  <button className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-neutral-800 rounded-full p-3 cursor-pointer shadow border-neutral-400 border hover:scale-110">
                    Tampilkan Semua Produk
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop & Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-md sm:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180, mass: 0.8 }}
              className="fixed inset-y-0 left-0 z-[100] w-[85%] bg-white dark:bg-neutral-950 p-6 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] sm:hidden flex flex-col"
            >
              {/* Header Menu */}
              <div className="flex justify-between items-center mb-10">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-black text-4xl tracking-tighter italic"
                >
                  VersePhone
                </motion.span>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-white"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 flex-1">
                {navItems?.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.1 + idx * 0.08, type: "spring", stiffness: 100, damping: 12 }}
                  >
                    <Link
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group relative flex items-center justify-between py-4"
                    >
                      <span className="text-4xl font-bold tracking-tighter text-neutral-800 dark:text-neutral-100 group-active:text-blue-600 transition-colors">
                        {item.name}
                      </span>
                      <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                    </Link>
                  </motion.div>
                ))}

                {/* Bagian Bawah Mobile Nav */}
                <div className="mt-auto mb-6">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 px-3 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl relative">
                        <span className="absolute top-3 right-3 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>

                        <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white shadow-md shadow-blue-500/20">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                            {user.username || "User"}
                            {user.role === "admin" && <ShieldCheck size={14} className="text-blue-500 flex-shrink-0" />}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium capitalize tracking-wider">{user.role}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all font-bold"
                      >
                        <span>Sign Out</span>
                        <LogOut size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Tampilan Box untuk Guest di Mobile */}
                      <div className="flex items-center gap-3 px-3 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
                        <div className="p-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-xl text-neutral-500 dark:text-neutral-400">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Guest Mode</span>
                          <span className="text-xs text-neutral-400 font-medium">Belum masuk akun</span>
                        </div>
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group w-full py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center gap-2 font-bold shadow-xl active:scale-95 transition"
                      >
                        <span>Sign In</span>
                        <DoorOpenIcon size={22} />
                      </Link>
                    </div>
                  )}
                </div>
              </nav>

              <AnimatedThemeToggler
                className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-neutral-200 dark:border-white/[0.2] shadow-lg self-start"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating pill nav */}
      <div className={cn("flex max-w-[95%] sm:max-w-fit fixed top-3 inset-x-0 mx-auto z-[40] items-center justify-center", className)}>
        <motion.div className="flex items-center justify-between sm:justify-center w-full gap-2 rounded-full border border-white/10 bg-white/80 px-3 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-black/50">

          {/* GRUP KIRI (Mobile Search & Hamburger) */}
          <div className="flex items-center gap-1 sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-neutral-600 dark:text-neutral-300 relative">
              <Menu className="w-6 h-6" />
              {user && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
            <NavSearch />
          </div>

          {/* NAV ITEMS DESKTOP */}
          <div className="hidden sm:flex items-center gap-1">
            <NavSearch />

            {navItems?.map((navItem, idx) => {
              const isProduct = navItem.name.toLowerCase() === "products";
              return (
                <div key={idx} className="relative" onMouseEnter={isProduct ? handleMouseEnter : undefined} onMouseLeave={isProduct ? handleMouseLeave : undefined}>
                  <Link href={navItem.link} className={cn("px-4 py-2 text-md font-medium transition-colors rounded-full block", isProduct && isProductOpen ? "bg-neutral-100 dark:bg-white/10" : "hover:bg-neutral-100 dark:hover:bg-white/10")}>
                    {navItem.name}
                  </Link>
                </div>
              );
            })}
            <AnimatedThemeToggler
              className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-neutral-200 dark:border-white/[0.2] shadow-lg"
            />
          </div>

          <div className="h-5 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block mx-2" />

          {/* GRUP KANAN DESKTOP (Unified Profile Dropdown) */}
          <div className="flex items-center gap-1 relative">
            <div
              className="relative"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              {/* Tombol pemicu dropdown yang konstan di desktop */}
              <button
                className={cn(
                  "flex items-center justify-center p-2.5 rounded-full shadow duration-200 transition-all cursor-pointer",
                  user
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black ring-2 ring-emerald-500/50 dark:ring-emerald-400/60 ring-offset-2 ring-offset-white dark:ring-offset-black hover:scale-105"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                )}
              >
                <User size={20} />
              </button>

              {/* Dropdown Menu Desktop Container */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-white/10 p-2 shadow-xl z-50 text-left"
                  >
                    {user ? (
                      /* KONDISI: USER SUDAH LOGIN */
                      <>
                        <div className="px-3 py-2.5 border-b border-neutral-100 dark:border-white/5 mb-1">
                          <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold truncate text-neutral-800 dark:text-neutral-100 flex items-center gap-1 mt-0.5">
                            {user.username || "User"}
                            {user.role === "admin" && <ShieldCheck size={14} className="text-blue-500" />}
                          </p>
                        </div>

                        {user.role === "admin" && (
                          <Link href="/dashboard" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-xl transition font-medium">
                            <ShieldCheck size={16} className="text-neutral-400" />
                            Dashboard Admin
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition font-bold"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      /* KONDISI: USER BELUM LOGIN (GUEST) */
                      <>
                        <div className="px-3 py-2.5 border-b border-neutral-100 dark:border-white/5 mb-1">
                          <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Selamat Datang</p>
                          <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mt-0.5">
                            Guest Account
                          </p>
                        </div>

                        <Link href="/login" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-xl transition font-medium">
                          <LogIn size={16} className="text-neutral-400" />
                          Sign In / Login
                        </Link>

                        <Link href="/register" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-xl transition font-medium">
                          <UserPlus size={16} className="text-neutral-400" />
                          Buat Akun Baru
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
};