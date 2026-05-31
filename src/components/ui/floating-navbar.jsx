"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X, DoorOpenIcon, ArrowRight, User, LogOut, ShieldCheck, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavSearch } from "./floating-search";
import { AnimatedThemeToggler } from "./animated-theme-toggler";

// Helper untuk membuat slug URL yang aman
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

export const FloatingNav = ({ navItems, user: serverUser, className }) => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [user, setUser] = useState(serverUser);

  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const router = useRouter();

  useEffect(() => { setUser(serverUser); }, [serverUser]);

  useEffect(() => {
    async function fetchNavProducts() {
      try {
        const res = await fetch("/api/product");
        if (res.ok) {
          const data = await res.json();
          setDynamicProducts(data.slice(0, 10));
        }
      } catch (error) { console.error("Error:", error); }
    }
    fetchNavProducts();
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      if (!isAnimatingRef.current) setIsProductOpen(true);
    }, 60);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => { setIsProductOpen(false); }, 180);
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) { window.location.href = "/"; }
  };

  return (
    <>
      {/* Product Dropdown */}
      <AnimatePresence onExitComplete={() => { isAnimatingRef.current = false; }}>
        {isProductOpen && dynamicProducts.length > 0 && (
          <motion.div
            className="fixed top-0 left-0 w-full z-[40] hidden sm:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 0px)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 0px)" }}
          >
            <div className="w-full bg-white border-b border-neutral-100 shadow-lg dark:bg-black">
              <div className="max-w-[1400px] mx-auto px-4 pt-26 pb-6">
                <div className="flex gap-12 overflow-x-auto scroll-smooth">
                  {dynamicProducts.map((hp, i) => (
                    <motion.div
                      key={hp.id_produk || i}
                      onClick={() => {
                        setIsProductOpen(false);
                        const slug = createSlug(hp.jenis || hp.nama);
                        router.push(`/products/${slug}`);
                      }}
                      className="cursor-pointer w-[150px] flex-shrink-0"
                    >
                      <div className="w-full aspect-[3/4] rounded-[12px] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
                        <img
                          src={hp.gambar?.startsWith("data:") ? hp.gambar : `data:image/jpeg;base64,${hp.gambar}`}
                          alt={hp.jenis}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="mt-2 text-center text-sm font-semibold">{hp.jenis || hp.nama}</p>
                    </motion.div>
                  ))}
                </div>
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

          {/* GRUP KANAN DESKTOP */}
          <div className="flex items-center gap-1 relative">
            <div
              className="relative"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
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