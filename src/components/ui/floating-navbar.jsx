"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const products = [
  { name: "Y05", image: "/test1.png", status: "baru" },
  { name: "X300 Pro", image: "/test2.png", status: "baru" },
  { name: "X300", image: "/4e0e2a2fdc70a2deea769ed379b90c44.png", status: "baru" },
  { name: "Y21d", image: "/test1.png", status: "baru" },
  { name: "V60 Lite 5G", image: "/test1.png", status: "baru" },
  { name: "V60 Lite", image: "/test1.png", status: "baru" },
  { name: "V60", image: "/test1.png", status: "baru" },
];

export const FloatingNav = ({ navItems, className }) => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const handleMouseEnter = useCallback(() => {
    // Cancel any pending close
    clearTimeout(closeTimeoutRef.current);
    // Small delay on open to prevent flicker when quickly passing over
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
      {/* Full-width dropdown backdrop — sits outside the pill nav */}
      <AnimatePresence
        onExitComplete={() => { isAnimatingRef.current = false; }}
      >
        {isProductOpen && (
          <motion.div
            key="product-dropdown"
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 0px)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0% round 0px)" }}
            transition={{
              clipPath: {
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              },
              opacity: { duration: 0.12, ease: "easeOut" },
            }}
            onAnimationStart={() => { isAnimatingRef.current = true; }}
            onAnimationComplete={() => { isAnimatingRef.current = false; }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed top-[72px] left-0 w-full z-[4999]"
          >
            <div className="w-full bg-white border-b border-neutral-100 shadow-lg shadow-black/[0.06] dark:bg-neutral-950 dark:border-white/10">
              <div className="max-w-[1400px] mx-auto px-10 pt-8 pb-6">

                {/* Product row — 7 visible, scroll right if more */}
                <div className="flex gap-10 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {products.map((hp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.04,
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="flex flex-col items-center group/card cursor-pointer flex-shrink-0 w-[calc((100%-2*1rem)/2)] sm:w-[calc((100%-6*1rem)/7)]"
                    // mobile: 3 visible | desktop sm+: 7 visible
                    >
                      {/* Image container — taller aspect ratio for phones */}
                      <div className="w-full aspect-[3/4] rounded-[20px] bg-neutral-50 flex items-center justify-center p-15 transition-all duration-500 group-hover/card:scale-[1.04] group-hover/card:bg-neutral-100 group-hover/card:shadow-xl dark:bg-neutral-900 dark:group-hover/card:bg-neutral-800">
                        <img
                          src={hp.image}
                          alt={hp.name}
                          className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                        />
                      </div>

                      {/* Label */}
                      <div className="mt-4 text-center flex flex-col items-center gap-1.5">
                        <span className="text-[15px] font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                          {hp.name}
                        </span>
                        {hp.status && (
                          <span className="text-[10px] text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
                            {hp.status}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex justify-center gap-8 py-5 border-t border-neutral-100 dark:border-white/10">
                <button className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-all duration-200 hover:gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Tampilkan Semua Produk
                </button>
                <div className="w-px bg-neutral-200/10 dark:bg-white/10" />
                <button className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-all duration-200 hover:gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Bandingkan Ponsel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill nav */}
      <div className={cn("flex max-w-fit fixed top-5 inset-x-0 mx-auto z-[5000] items-center justify-center", className)}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/80 px-2 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-black/50"
        >
          <div className="flex items-center gap-1">
            {navItems?.map((navItem, idx) => {
              const isProduct = navItem.name.toLowerCase() === "product";

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
                      "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isProduct && isProductOpen
                        ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    <span className="block sm:hidden">{navItem.icon}</span>
                    <span className="hidden sm:block">{navItem.name}</span>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="h-5 w-px bg-neutral-200 dark:bg-white/10" />

          <Link href="/login">
            <button className="relative rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 dark:bg-white dark:text-black dark:hover:bg-neutral-100">
              <span>Login</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </>
  );
};