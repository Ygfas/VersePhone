'use client'
// app/products/[slug]/ProductDetailContent.jsx

import { useState, useEffect } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion" // Tambahkan AnimatePresence
import { formatPrice } from "@/lib/products"
import Link from "next/link"

export default function ProductDetailContent({ user: serverUser }) {
    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()

    const [user, setUser] = useState(serverUser)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedColor, setSelectedColor] = useState("")
    const [selectedRAM, setSelectedRAM] = useState("")
    const [selectedStorage, setSelectedStorage] = useState("")
    
    // State baru untuk mengontrol notifikasi custom
    const [showAuthAlert, setShowAuthAlert] = useState(false)

    useEffect(() => {
        setUser(serverUser)
    }, [serverUser])

    useEffect(() => {
        async function getProductDetail() {
            try {
                const res = await fetch(`/api/product/${params.slug}`)
                if (res.ok) {
                    const data = await res.json()
                    setProduct(data)
                    if (data.colors?.length > 0) setSelectedColor(data.colors[0])

                    const ramValue = data.specs?.RAM || data.RAM
                    if (ramValue) {
                        setSelectedRAM(ramValue.includes("GB") ? ramValue : `${ramValue} GB`)
                    }

                    if (data.storage?.length > 0) setSelectedStorage(data.storage[0])
                }
            } catch (err) {
                console.error("Gagal memuat detail produk:", err)
            } finally {
                setLoading(false)
            }
        }
        if (params.slug) getProductDetail()
    }, [params.slug])

    const handleBuyNow = () => {
        if (!user) {
            // Tampilkan custom alert
            setShowAuthAlert(true)
            
            // Beri jeda 2 detik agar pesan terbaca sebelum pindah halaman
            setTimeout(() => {
                setShowAuthAlert(false)
                router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
            }, 2000)
            return
        }

        const targetId = product?.id

        if (!targetId) {
            alert("Gagal memproses ID Produk. Pastikan data produk telah termuat sempurna.")
            return
        }

        const query = new URLSearchParams({
            productId: targetId,
            slug: params.slug,
            warna: selectedColor,
            ram: selectedRAM,
            storage: selectedStorage,
        })

        router.push(`/payment?${query.toString()}`)
    }

    const handleShare = async () => {
        const shareData = {
            title: product?.title || "VersePhone",
            text: `Cek ${product?.title} ini di VersePhone!`,
            url: window.location.href,
        }
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData)
            } catch (error) {
                if (error.name !== 'AbortError') console.error("Error sharing:", error)
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href)
                alert("Link produk telah disalin ke clipboard!")
            } catch (err) {
                console.error("Gagal menyalin link:", err)
            }
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Memuat Detail Spesifikasi...</div>

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
                <Link href="/products" className="mt-4 text-blue-600 underline">Kembali ke katalog</Link>
            </div>
        )
    }

    const ramOptions = product.specs?.RAM ? [product.specs.RAM] : (product.RAM ? [`${product.RAM} GB`] : [])

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 pb-20 relative">
            
            {/* --- CUSTOM TOAST NOTIFICATION --- */}
            <AnimatePresence>
                {showAuthAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 shadow-xl rounded-2xl px-5 py-3.5 w-[90%] max-w-sm"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-300 leading-snug">
                            Kamu harus login terlebih dahulu untuk melakukan checkout! Mengalihkan...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* -------------------------------- */}

            {/* Sticky Mini Header */}
            <div className="sticky md:top-0 h-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-4 z-[30]">
                <div className="max-w-7xl mt-5 mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="hidden md:block font-bold text-slate-800 dark:text-white truncate max-w-[300px]">{product.title}</h2>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* GALLERY */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-32 bg-slate-50 dark:bg-neutral-800/50 rounded-[40px] p-8 lg:p-16 flex justify-center items-center overflow-hidden"
                        >
                            <motion.img
                                src={product.image}
                                alt={product.title}
                                className="max-h-[500px] w-auto object-contain drop-shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.div>
                    </div>

                    {/* INFO & VARIAN */}
                    <div className="lg:col-span-5 space-y-10">
                        <section>
                            <p className="text-blue-600 font-bold tracking-widest text-xs mb-2 uppercase">{product.brand}</p>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
                                {product.title}
                            </h1>
                        </section>

                        {/* HARGA & STOK */}
                        <section className="py-6 border-y border-slate-100 dark:border-white/5">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black text-blue-600">{formatPrice(product.price)}</span>
                            </div>
                            <p className="text-green-600 text-sm font-bold mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                                Stok Tersedia ({product.stock} unit)
                            </p>
                        </section>

                        {/* PILIH WARNA */}
                        {product.colors?.length > 0 && (
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
                        )}

                        {/* PILIH RAM */}
                        {ramOptions.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pilihan Kapasitas RAM</h3>
                                <div className="flex flex-wrap gap-3">
                                    {ramOptions.map((ram) => (
                                        <button
                                            key={ram}
                                            onClick={() => setSelectedRAM(ram)}
                                            className={`px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${selectedRAM === ram
                                                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                                : 'border-slate-100 dark:border-white/5 dark:text-white hover:border-slate-200'
                                                }`}
                                        >
                                            {ram}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PILIH STORAGE */}
                        {product.storage?.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pilih Kapasitas Internal Storage</h3>
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
                        )}

                        {/* TOMBOL AKSI */}
                        <div className="flex flex-col gap-4 pt-4">
                            <motion.div className="mt-8 flex justify-center">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBuyNow}
                                    disabled={showAuthAlert} // Cegah klik berulang saat alert sedang tampil
                                    className="w-full md:w-[25vw] rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    Beli Sekarang
                                </motion.button>
                            </motion.div>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={handleShare}
                                    className="py-4 border border-slate-300 dark:border-white/10 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    Share Produk
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SPESIFIKASI DINAMIS */}
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
                        {product.specs && Object.entries(product.specs).map(([key, value], i) => (
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