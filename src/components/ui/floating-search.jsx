'use client'
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const FloatingSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

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

    const suggestions = ["Komponen UI", "Desain sistem", "Animasi interaktif", "Responsif layout", "Framer Motion"];
    const filtered = query ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())) : [];

    // Lebar saat expanded: mobile ~full, tablet & desktop 80vw (dari posisi icon ke kanan)
    const expandedWidth =
        typeof window !== "undefined" && window.innerWidth < 768
            ? "calc(100vw - 3rem)"   // mobile: hampir full
            : "87vw";                 // tablet & desktop: 80% viewport

    return (
        
        <div className="fixed top-27 left-7 lg:left-20 xl:left-32 lg:top-27 z-[10] flex flex-col items-start gap-2">

         
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="search-bar"
                        initial={{ width: 48, opacity: 0 }}
                        animate={{ width: expandedWidth, opacity: 1 }}
                        exit={{ width: 48, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ originX: 0 }}
                        className={`flex items-center gap-3 rounded-full border bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all ${isFocused ? "border-blue-500 ring-4 ring-blue-500/10" : "border-gray-200"
                            }`}
                    >
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Cari produk..."
                            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
                        />
                        <button
                            onClick={() => query ? setQuery("") : setIsOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.button
                        key="search-btn"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-xl text-white"
                    >
                        <Search className="h-5 w-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Dropdown Hasil Pencarian */}
            <AnimatePresence>
                {isOpen && filtered.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ width: expandedWidth }}
                        className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
                    >
                        <div className="max-h-[350px] overflow-y-auto">
                            {filtered.map((item, i) => (
                                <button
                                    key={item}
                                    className="flex w-full items-center gap-3 px-5 py-3.5 text-sm text-left text-gray-700 hover:bg-blue-50 transition-colors border-b last:border-none border-gray-50"
                                    onClick={() => { setQuery(item); setIsOpen(false); }}
                                >
                                    <Search className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="truncate font-medium">{item}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingSearch;