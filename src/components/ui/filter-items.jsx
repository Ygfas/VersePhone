"use client";
import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FilterBrandItems() {
    const categories = [
        { id: "all", name: "Semua", logo: "https://www.svgrepo.com/show/502648/grid.svg" },
        { id: "apple", name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { id: "asus", name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/Asus_Logo.svg" },
        { id: "honor", name: "Honor", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Honor_logo.svg" },
        { id: "huawei", name: "Huawei", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Huawei_Logo.svg" },
        { id: "infinix", name: "Infinix", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Infinix_Logo.svg" },
        { id: "oppo", name: "Oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Oppo_Logo.svg" },
        { id: "realme", name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-logo.svg" },
        { id: "honor", name: "Honor", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Honor_logo.svg" },
        { id: "huawei", name: "Huawei", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Huawei_Logo.svg" },
        { id: "infinix", name: "Infinix", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Infinix_Logo.svg" },
        { id: "oppo", name: "Oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Oppo_Logo.svg" },
        { id: "realme", name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-logo.svg" },
        { id: "huawei", name: "Huawei", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Huawei_Logo.svg" },
        { id: "infinix", name: "Infinix", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Infinix_Logo.svg" },
        { id: "oppo", name: "Oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Oppo_Logo.svg" },
        { id: "realme", name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-logo.svg" },
        { id: "infinix", name: "Infinix", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Infinix_Logo.svg" },
        { id: "oppo", name: "Oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/Oppo_Logo.svg" },
        { id: "realme", name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-logo.svg" },
    ];

    const [active, setActive] = useState("all");
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            // Scroll setengah lebar container agar transisi tidak terlalu jauh
            const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full bg-orange-400 py-10 my-10 relative group overflow-hidden">
            {/* BAGIAN YANG DIUBAH: 
        1. Menambahkan 'max-w-[90%] md:max-w-7xl' agar tidak mentok ke pinggir layar.
        2. Menambahkan 'mx-auto' agar posisinya tetap di tengah.
    */}
            <div className="max-w-[95%] md:max-w-[90%] mx-auto relative">

                {/* Tombol Panah Kiri */}
                <button
                    onClick={() => scroll("left")}
                    /* Posisi panah disesuaikan (left-0) karena pembungkusnya sudah punya jarak */
                    className="absolute -left-10 top-[45%] -translate-y-1/2 z-30 bg-white hover:bg-gray-100 p-2 rounded-full shadow-2xl hidden md:flex transition-all hover:scale-110 active:scale-95 border border-slate-400"
                >
                    <ChevronLeft size={24} className="text-orange-500" />
                </button>

                {/* Container Utama */}
                <div
                    ref={scrollRef}
                    /* px-10 memberikan ruang agar brand tidak menempel ke tombol panah */
                    className="flex items-center overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-14 pt-2 gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={`
                        flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-center
                        /* Sesuaikan pembagi (misal /6 atau /8) agar item pas di dalam container yang mengecil */
                        w-[calc((100%-2rem)/4)] 
                        md:w-[calc((100%-4rem)/8)] 
                    `}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                            relative flex items-center justify-center 
                            aspect-square w-full max-w-[80px] md:max-w-[120px]
                            rounded-full transition-all duration-500
                            ${active === item.id
                                        ? "bg-white shadow-lg ring-4 ring-white/50"
                                        : "bg-white/90 shadow-md hover:bg-white"
                                    }
                        `}
                            >
                                <div className="w-1/2 h-1/2 flex items-center justify-center">
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className={`
                                    max-w-full max-h-full object-contain transition-all duration-500
                                    ${active === item.id ? "grayscale-0 scale-110" : "grayscale opacity-60"}
                                `}
                                    />
                                </div>
                            </motion.div>

                            <span className={`
                        text-[9px] md:text-xs font-black uppercase tracking-widest transition-all
                        ${active === item.id ? "text-white" : "text-white/70"}
                    `}>
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Tombol Panah Kanan */}
                <button
                    onClick={() => scroll("right")}
                    /* Posisi panah disesuaikan (right-0) */
                    className="absolute -right-10 top-[45%] -translate-y-1/2 z-30 bg-white hover:bg-gray-100 p-2 rounded-full shadow-2xl hidden md:flex transition-all hover:scale-110 active:scale-95 border border-slate-400"
                >
                    <ChevronRight size={24} className="text-orange-500" />
                </button>

            </div>
        </div>
    );
}