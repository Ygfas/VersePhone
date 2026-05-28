'use client'
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const NavSearch = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const inputRef = useRef(null);

    // 1. Fetch seluruh data produk dari DB saat komponen di-mount
    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch('/api/product/search');
                if (res.ok) {
                    const data = await res.json();

                    const localizedData = data.map(item => ({
                        id: item.id_produk,
                        name: item.jenis || item.nama, // Menampilkan Jenis (Model) perangkat
                        brandName: item.nama,          // Menyimpan nama/brand asli untuk opsi fallback pencarian
                        slug: item.nama                // Identifier routing detail
                    }));
                    setProducts(localizedData);
                }
            } catch (err) {
                console.error("Gagal memuat list produk untuk search:", err);
            }
        }
        loadProducts();
    }, []);

    // Auto focus aman
    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    // Keyboard shortcut handler (Ctrl/Cmd + K)
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                setQuery("");
                setErrorMsg("");
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // 2. Filter list rekomendasi dropdown berdasarkan ketikan teks 'jenis' (p.name) ATAU 'nama brand' (p.brandName)
    const filteredProducts = query
        ? products.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brandName.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    // 3. Ketika jenis produk di dropdown diklik
    const handleSuggestionClick = (slug) => {
        setIsOpen(false);
        setQuery("");
        router.push(`/products/${slug}`);
    };

    // 4. Aturan jika menekan Enter di kolom search (Bisa deteksi jenis langsung atau melempar query ke katalog)
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const trimmedQuery = query.trim();

            if (!trimmedQuery) return;

            // Jika ada hasil yang cocok di dropdown (baik 1 atau lebih), lempar parameter ke URL katalog
            if (filteredProducts.length > 0) {
                setIsOpen(false);
                setQuery("");
                setErrorMsg("");
                router.push(`/products?search=${encodeURIComponent(trimmedQuery.toLowerCase())}`);
                return;
            }

            // OPSI TERBARU: Jika produk BENAR-BENAR tidak terdaftar di database (filteredProducts kosong)
            // Tetap lempar ke page product utama agar halaman tersebut menampilkan pesan "Tidak ada produk..."
            setIsOpen(false);
            setQuery("");
            setErrorMsg("");
            router.push(`/products?search=${encodeURIComponent(trimmedQuery.toLowerCase())}`);
        }
    };
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
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className={cn(
                            "flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1 border transition-colors w-48 sm:w-60",
                            errorMsg ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "border-transparent"
                        )}
                    >
                        <Search size={16} className={cn("shrink-0", errorMsg ? "text-red-500" : "text-neutral-400")} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={errorMsg ? errorMsg : query}
                            onChange={(e) => {
                                if (!errorMsg) {
                                    setQuery(e.target.value);
                                }
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Cari jenis produk..."
                            className={cn(
                                "bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none p-2 placeholder-neutral-400",
                                errorMsg ? "text-red-500 font-medium" : "text-neutral-800 dark:text-white"
                            )}
                            disabled={!!errorMsg}
                        />
                        <button onClick={() => { setIsOpen(false); setQuery(""); setErrorMsg(""); }}>
                            <X size={16} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hasil Search Dropdown Menampilkan Jenis */}
            <AnimatePresence>
                {isOpen && filteredProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[calc(100%+19px)] left-[-12px] right-[-12px] sm:left-0 sm:right-0 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="max-h-[280px] overflow-y-auto p-2 layout-scrollbar">
                            {filteredProducts.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSuggestionClick(item.slug)}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <Search size={14} className="opacity-40 shrink-0" />
                                    <span className="truncate font-medium">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};