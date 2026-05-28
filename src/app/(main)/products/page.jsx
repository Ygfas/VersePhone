'use client'
// app/products/page.jsx

import { useState, useEffect, useMemo } from "react" // 1. Tambahkan useMemo
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import FilterBrandItems from "@/components/ui/filter-items"
import { formatPrice } from "@/lib/products"

export default function Products() {
    const searchParams = useSearchParams();

    // Ambil keyword dari URL parameter, pastikan fallback-nya string kosong dan di-trim
    const searchQuery = searchParams.get("search") || "";

    const [productList, setProductList] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeBrand, setActiveBrand] = useState("all")

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/product')
                if (res.ok) {
                    const data = await res.json()
                    const formattedData = data.map(item => ({
                        id: item.id_produk,
                        slug: item.nama,
                        brand: item.nama,
                        // Pastikan item.jenis terisi dengan benar ke properti title
                        title: item.jenis || item.nama,
                        price: parseFloat(item.harga) * 1000000,
                        originalPrice: parseFloat(item.harga) * 1000000,
                        stock: item.stok !== undefined && item.stok !== null ? item.stok : 0,
                        image: item.gambar ? `data:image/jpeg;base64,${item.gambar}` : "/placeholder.png"
                    }))
                    setProductList(formattedData)
                }
            } catch (err) {
                console.error("Gagal memuat produk:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // 2. Bungkus fungsi filter menggunakan useMemo supaya otomatis mendeteksi perubahan `searchQuery`
    const filteredProducts = useMemo(() => {
        return productList.filter(product => {
            // Bersihkan query pencarian
            const cleanSearch = searchQuery.toLowerCase().trim();

            // Pengecekan 1: Cocok dengan search bar (Cek di kolom 'jenis/title' dan 'brand')
            const matchesSearch = cleanSearch
                ? String(product.title).toLowerCase().includes(cleanSearch) ||
                String(product.brand).toLowerCase().includes(cleanSearch)
                : true;

            // Pengecekan 2: Cocok dengan filter bulatan brand di UI
            const matchesBrand = activeBrand === "all"
                ? true
                : product.brand.toLowerCase() === activeBrand.toLowerCase();

            return matchesSearch && matchesBrand;
        });
    }, [productList, searchQuery, activeBrand]); // Berjalan ulang jika 3 variabel ini berubah

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Memuat Katalog Produk...</div>

    return (
        <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-neutral-950">
            <div className="pb-24 lg:px-20 bg-slate-100/50 dark:bg-neutral-950">

                {/* Komponen Filter Lingkaran Brand */}
                <FilterBrandItems activeBrand={activeBrand} setActiveBrand={setActiveBrand} />

                {/* Grid Produk */}
                <motion.div
                    layout
                    className="grid grid-cols-2 xl:grid-cols-3 gap-8 mx-12"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/products/${item.slug}`} className="block group outline-none">
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="relative bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-white/5
                                         shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-[24px] overflow-hidden cursor-pointer"
                                    >
                                        <figure className="relative w-full bg-slate-50 dark:bg-neutral-800/50 flex justify-center p-8 overflow-hidden">
                                            <motion.img
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                src={item.image}
                                                alt={item.title}
                                                className="rounded-lg object-contain lg:max-h-[240px] max-h-36 drop-shadow-xl"
                                            />
                                        </figure>

                                        <div className="p-6">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
                                                {item.brand}
                                            </p>
                                            <h1 className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-white
                                           group-hover:text-blue-600 transition-colors leading-tight">
                                                {item.title}
                                            </h1>

                                            <div className="mt-3">
                                                <p className="text-xl font-bold text-slate-800 dark:text-white">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-6 pb-5 flex items-center justify-between">
                                            <span className="text-xs text-slate-400">Stok: {item.stock} unit</span>
                                            <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center
                                           group-hover:bg-blue-600 transition-colors">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                    className="text-blue-500 group-hover:text-white transition-colors">
                                                    <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5"
                                                        strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Fallback jika hasil filter kosong */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-24 text-neutral-400 font-medium">
                        Tidak ada produk pencarian yang cocok dengan `{searchQuery}`
                    </div>
                )}
            </div>
        </div>
    )
}