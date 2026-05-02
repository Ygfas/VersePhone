'use client'
// app/products/page.jsx  ← halaman daftar produk

import Link from "next/link"
import { motion } from "framer-motion"
import FilterItems from "@/components/ui/filter-items"
import { products, formatPrice } from "@/lib/products"


export default function Products() {
    return (

        
        <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-neutral-900">
            <div className="pb-24 lg:px-20 bg-slate-100/50 dark:bg-neutral-900">
                <FilterItems />
               
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 xl:grid-cols-3 gap-8 mx-12"
                >
                    {products.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            {/* 
                Ganti Dialog + DialogTrigger dengan Link biasa.
                Klik card → navigasi ke /products/[slug]
              */}
              
                            <Link href={`/products/${item.slug}`} className="block group outline-none">
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="relative bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-white/5
                             shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-[24px] overflow-hidden cursor-pointer"
                                >
                                    {/* Badge */}
                                    {item.badge && (
                                        <span className="absolute top-4 left-4 z-10 text-[11px] font-semibold px-2.5 py-1 rounded-full
                                     bg-blue-600 text-white tracking-wide">
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Gambar produk */}
                                    <figure className="relative w-full bg-slate-50 dark:bg-neutral-800/50 flex justify-center p-8 overflow-hidden">
                                        <motion.img
                                            whileHover={{ scale: 1.08 }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            src={item.image}
                                            alt={item.title}
                                            className="rounded-lg object-contain lg:max-h-[240px] max-h-36 drop-shadow-xl"
                                        />
                                    </figure>

                                    {/* Info */}
                                    <div className="p-6">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                                            {item.brand}
                                        </p>
                                        <h1 className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-white
                                   group-hover:text-blue-600 transition-colors leading-tight">
                                            {item.title}
                                        </h1>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                        <path
                                                            d="M6.5 1l1.4 2.9 3.1.4-2.3 2.2.5 3.1L6.5 8 3.8 9.6l.5-3.1L2 4.3l3.1-.4L6.5 1z"
                                                            fill={i < Math.floor(item.rating) ? "#F59E0B" : "#E2E8F0"}
                                                        />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-400">({item.reviews})</span>
                                        </div>

                                        {/* Harga */}
                                        <div className="mt-3">
                                            <p className="text-xl font-bold text-slate-800 dark:text-white">
                                                {formatPrice(item.price)}
                                            </p>
                                            {item.originalPrice > item.price && (
                                                <p className="text-sm text-slate-400 line-through">
                                                    {formatPrice(item.originalPrice)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer arrow hint */}
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
                </motion.div>
            </div>
        </div>
    )
}