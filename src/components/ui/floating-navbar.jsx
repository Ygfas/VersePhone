"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCart, Menu, X, DoorOpenIcon, ArrowRight } from "lucide-react"; // Tambah Menu & X
import { INITIAL_CART } from "@/app/(main)/cart/page";

const products = [
  { name: "Y05", image: "/test1.png", status: "baru" },
  { name: "X300 Pro", image: "/test2.png", status: "baru" },
  { name: "X300", image: "/4e0e2a2fdc70a2deea769ed379b90c44.png", status: "baru" },
  { name: "Y21d", image: "/test1.png", status: "baru" },
  { name: "V60 Lite 5G", image: "/test1.png", status: "baru" },
  { name: "V60 Lite", image: "/test1.png", status: "baru" },
  { name: "V60", image: "/test1.png", status: "baru" },
  { name: "V60", image: "/test1.png", status: "baru" },
];

export const FloatingNav = ({ navItems, className }) => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State baru
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

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

  return (
    <>
      {/* Product Dropdown (Desktop Only via hidden sm:block) */}
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
            className="fixed top-0 left-0 w-full z-[30] hidden sm:block"
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
                <div className="w-px bg-neutral-200/10" />
                <Link href={'/products'} asChild>
                  <button className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-neutral-800 rounded-full p-3 cursor-pointer shadow border-neutral-400 border hover:scale-110" >
                    Tampilkan Semua Produk</button>
                </Link>
                <div className="w-px bg-neutral-200/10" />

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop & Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 1. Backdrop dengan Blur Lembut */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-md sm:hidden"
            />

            {/* 2. Container Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,    // Mengurangi goyangan berlebih
                stiffness: 180, // Kecepatan tarikan
                mass: 0.8
              }}
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

              {/* Navigation Links dengan Stagger Effect */}
              <nav className="flex flex-col gap-2">
                {navItems?.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.1 + idx * 0.08, // Muncul satu per satu
                      type: "spring",
                      stiffness: 100,
                      damping: 12
                    }}
                  >
                    <Link
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group relative flex items-center justify-between py-4"
                    >
                      <span className="text-4xl font-bold tracking-tighter text-neutral-800 dark:text-neutral-100 group-active:text-blue-600 transition-colors">
                        {item.name}
                      </span>

                      {/* Dekorasi Garis bawah yang muncul saat di-tap/hover */}
                      <motion.div
                        className="absolute bottom-2 left-0 h-[3px] bg-blue-600"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                      />

                      <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                    </Link>
                  </motion.div>
                ))}

                {/* Bagian Login yang menonjol */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mt-auto mb-6" // Mendorong login ke bawah sidebar
                >
                  <Link
                    href="/login"
                    className="group w-full py-5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center gap-4 overflow-hidden relative active:scale-95 transition-transform shadow-xl"
                  >
                    <span className="font-bold text-xl relative z-10">Sign In</span>
                    <DoorOpenIcon size={22} className="relative z-10" />

                    {/* Efek kilauan pada tombol */}
                    <motion.div
                      className="absolute inset-0 bg-blue-500/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating pill nav */}
      <div className={cn("flex max-w-[90%] sm:max-w-fit fixed top-3 inset-x-0 mx-auto z-[40] items-center justify-center", className)}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between sm:justify-center w-full gap-2 rounded-full border border-white/10 bg-white/80 px-3 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-black/50"
        >
          {/* Hamburger (Mobile Only) - Diletakkan di Kiri */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="block sm:hidden p-2 text-neutral-600 dark:text-neutral-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Nav Items (Desktop Only) */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems?.map((navItem, idx) => {
              const isProduct = navItem.name.toLowerCase() === "products";
              return (
                <div
                  key={`link-${idx}`}
                  className="relative"
                  onMouseEnter={isProduct ? handleMouseEnter : undefined}
                  onMouseLeave={isProduct ? handleMouseLeave : undefined}
                >
                  <Link
                    href={navItem.link}
                    className={cn(
                      "relative flex items-center gap-1 rounded-full px-4 py-2 text-md font-medium transition-colors",
                      isProduct && isProductOpen
                        ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    {navItem.name}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="h-5 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block" />

          {/* Login & Cart Section */}
          <div className="flex items-center gap-1">
            <Link href="/login" className="hidden sm:block">
              <button className="relative rounded-full bg-neutral-900 px-4 py-2 text-md font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-black">
                <span>Login</span>
              </button>
            </Link>

            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-3 text-neutral-600 hover:text-blue-600 dark:text-neutral-300 transition-colors"
              >
                <ShoppingCart className="w-[22px] h-[22px]" />
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-extrabold text-white ring-2 ring-white">
                  {INITIAL_CART.length}
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
