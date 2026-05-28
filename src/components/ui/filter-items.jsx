"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FilterBrandItems({ activeBrand, setActiveBrand }) {
    const categories = [
        { id: "all", name: "Semua", logo: null }, // Menambahkan opsi Semua untuk reset filter
        { id: "samsung", name: "Samsung", logo: "/brand/samsung.jpg" },
        { id: "apple", name: "Apple", logo: "/brand/iphone.jpg" },
        { id: "xiaomi", name: "Xiaomi", logo: "/brand/xiaomi.jpg" },
        { id: "poco", name: "Poco", logo: "/brand/poco.png" },
        { id: "vivo", name: "Vivo", logo: "/brand/vivo.jpg" },
        { id: "iqoo", name: "Iqoo", logo: "/brand/Iqoo.jpg" },
        { id: "oppo", name: "Oppo", logo: "/brand/oppo.jpg" },
        { id: "realme", name: "Realme", logo: "/brand/realme.jpg" },
        { id: "tecno", name: "Tecno", logo: "/brand/Tecno.jpg" },
        { id: "infinix", name: "Infinix", logo: "/brand/Infinix.jpg" },
    ];

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full bg-gradient-to-r from-red-900 to-red-800 py-10 my-10 relative group overflow-hidden rounded-[32px] shadow-xl">
            <div className="max-w-[95%] md:max-w-[90%] mx-auto relative">

                {/* Tombol Panah Kiri */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute -left-5 lg:-left-10 top-[45%] -translate-y-1/2 z-30 bg-white dark:bg-neutral-800 hover:bg-gray-100 p-2 rounded-full shadow-2xl hidden md:flex transition-all hover:scale-110 active:scale-95 border border-slate-300 dark:border-neutral-700"
                >
                    <ChevronLeft size={24} className="text-slate-500 dark:text-neutral-400" />
                </button>

                {/* Container Utama */}
                <div
                    ref={scrollRef}
                    className="flex items-center overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-14 pt-2 gap-6"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveBrand(item.id)}
                            className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-center w-[calc((100%-4rem)/4)] md:w-[calc((100%-8rem)/8)]"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    relative flex items-center justify-center 
                                    aspect-square w-full max-w-[80px] md:max-w-[120px]
                                    rounded-full transition-all duration-500 overflow-hidden
                                    ${activeBrand === item.id
                                        ? "bg-white shadow-lg ring-4 ring-blue-500/80 scale-105"
                                        : "bg-white shadow-md hover:shadow-lg"
                                    }
                                `}
                            >
                                <div className="md:w-24 md:h-24 h-14 w-14 flex items-center justify-center p-2">
                                    {item.logo ? (
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            className="max-w-full max-h-full object-contain transition-all duration-500"
                                        />
                                    ) : (
                                        // Tampilan Fallback Huruf untuk tombol "Semua"
                                        <span className="text-sm md:text-lg font-black text-slate-800 uppercase">
                                            All
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            <span className={`
                                text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all text-center truncate max-w-full
                                ${activeBrand === item.id ? "text-blue-400 font-black scale-105" : "text-white/70"}
                            `}>
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Tombol Panah Ritel */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute -right-5 lg:-right-10 top-[45%] -translate-y-1/2 z-30 bg-white dark:bg-neutral-800 hover:bg-gray-100 p-2 rounded-full shadow-2xl hidden md:flex transition-all hover:scale-110 active:scale-95 border border-slate-300 dark:border-neutral-700"
                >
                    <ChevronRight size={24} className="text-slate-500 dark:text-neutral-400" />
                </button>

            </div>
        </div>
    );
}