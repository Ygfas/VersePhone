'use client'

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { products, formatPrice } from "@/lib/products"
import Link from "next/link"

export default function ProductDetail() {
    const params = useParams()
    const router = useRouter()

    // Cari produk berdasarkan slug
    const product = products.find((p) => p.slug === params.slug)

    // State untuk pilihan varian (Warna & RAM/ROM)
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
    const [selectedStorage, setSelectedStorage] = useState(product?.storage[0] || "")
    const itemVariants = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    };


    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
                <Link href="/products" className="mt-4 text-blue-600 underline">Kembali ke katalog</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 pb-20">
            {/* 1. Sticky Mini Header (Ala Erafone) */}
            <div className="sticky md:top-0 h-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-4 z-[30]">
                <div className="max-w-7xl mt-5 mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="hidden md:block font-bold text-slate-800 dark:text-white truncate max-w-[300px]">{product.title}</h2>
                    </div>
                    {/* <div className="flex items-center gap-4">
                        <span className="hidden lg:block font-bold text-blue-600">{formatPrice(product.price)}</span>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                            Beli Sekarang
                        </button>
                    </div> */}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* --- SISI KIRI: GALLERY (Sticky) --- */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-32 bg-slate-50 dark:bg-neutral-800/50 rounded-[40px] p-8 lg:p-16 flex justify-center items-center overflow-hidden"
                        >
                            <motion.img
                                layoutId={`product-image-${product.id}`}
                                src={product.image}
                                alt={product.title}
                                className="max-h-[500px] w-auto object-contain drop-shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                            />
                            {product.badge && (
                                <span className="absolute top-8 left-8 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                                    {product.badge}
                                </span>
                            )}
                        </motion.div>
                    </div>

                    {/* --- SISI KANAN: INFO & VARIAN --- */}
                    <div className="lg:col-span-5 space-y-10">
                        <section>
                            <p className="text-blue-600 font-bold tracking-widest text-xs mb-2 uppercase">{product.brand}</p>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-3 mt-4 text-sm font-medium">
                                <div className="flex items-center bg-amber-400/10 text-amber-600 px-2 py-1 rounded-md">
                                    ★ <span className="ml-1 font-bold">{product.rating}</span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <span className="text-slate-500">{product.reviews} Ulasan Pembeli</span>
                            </div>
                        </section>

                        {/* HARGA */}
                        <section className="py-6 border-y border-slate-100 dark:border-white/5">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black text-blue-600">{formatPrice(product.price)}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-xl text-slate-400 line-through font-medium">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="text-green-600 text-sm font-bold mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                                Stok Tersedia ({product.stock} unit)
                            </p>
                        </section>

                        {/* PILIH WARNA */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pilihan Warna</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${selectedColor === color
                                                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                                : 'border-slate-100 dark:border-white/5 dark:text-white hover:border-slate-200'
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* PILIH STORAGE */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pilih Kapasitas</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {product.storage.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedStorage(size)}
                                        className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${selectedStorage === size
                                                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                                : 'border-slate-100 dark:border-white/5 dark:text-white hover:border-slate-200'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* DESKRIPSI SINGKAT */}
                        <section className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-blue-600 pl-4">
                            "{product.description}"
                        </section>

                        {/* BUTTONS */}
                        <div className="flex flex-col gap-4 pt-4">
                            {/* <motion.button
                                whileTap={{ scale: 0.97 }}
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all"
                            >
                                TAMBAH KE KERANJANG
                            </motion.button> */}
                            <motion.div variants={itemVariants} className="mt-8 flex justify-center" >
                                <motion.button whileTap={{ scale: 0.90 }} className="w-[25vw] rounded-l-2xl bg-orange-600 py-4 font-bold text-white transition-all hover:opacity-80 active:scale-[0.98] ">Tambah Pesanan</motion.button>
                                <motion.button whileTap={{ scale: 0.90 }} className="w-[25vw] rounded-r-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:opacity-80 active:scale-[0.98] ">Beli Sekarang</motion.button>
                            </motion.div>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-4 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 dark:text-white">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    Wishlist
                                </button>
                                <button className="py-4 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 dark:text-white">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN BAWAH: SPESIFIKASI (Konsep Erafone) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 max-w-5xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Spesifikasi Lengkap</h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 gap-px bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                        {Object.entries(product.specs).map(([key, value], i) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`grid grid-cols-1 md:grid-cols-3 p-8 ${i % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-slate-50/50 dark:bg-neutral-800/30'}`}
                            >
                                <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 md:mb-0">
                                    {key}
                                </div>
                                <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-bold leading-relaxed text-lg">
                                    {value}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    )
}