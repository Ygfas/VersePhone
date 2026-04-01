'use client'
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const NavSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    // Auto focus saat terbuka
    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    // Shortcut CMD/CTRL + K
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                setQuery("");
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const suggestions = ["V60 Series", "X300 Pro", "Aksesoris", "Promo Ramadhan"];
    const filtered = query ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())) : [];

    return (
        <div className="relative flex items-center">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        key="search-icon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md transition-colors"
                    >
                        <Search size={20} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="search-input"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? "200px" : "240px", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1"
                    >
                        <Search size={16} className="text-neutral-400 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari produk..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-neutral-800 dark:text-white outline-none p-2"
                        />
                        <button onClick={() => { setIsOpen(false); setQuery("") }}>
                            <X size={16} className="text-neutral-400 hover:text-neutral-600" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hasil Search Dropdown */}
            <AnimatePresence>
                {isOpen && filtered.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        // Perhatikan penggunaan 'fixed' atau 'absolute' dengan kalkulasi posisi
                        className="absolute top-[calc(100%+19px)] left-[-12px] right-[-12px] sm:left-0 sm:right-0 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {filtered.map((item, i) => (
                                <button
                                    key={i}
                                    className="w-full text-left px-5 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all rounded-xl flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <Search size={14} className="opacity-50" />
                                    {item}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};