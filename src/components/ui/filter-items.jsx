"use client";
import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FilterBrandItems() {
    const categories = [
        { id: "samsung", name: "Samsung", logo: "/brand/samsung.jpg" },
        { id: "apple", name: "Apple", logo: "/brand/iphone.jpg" },
        { id: "xiaomi", name: "Xiaomi", logo: "/brand/xiaomi.jpg" },
        { id: "poco", name: "Poco", logo: "/brand/poco.png" },
        { id: "vivo", name: "Vivo", logo: "/brand/vivo.jpg" },
        { id: "iqoo", name: "Iqoo", logo: "/brand/Iqoo.jpg" },
        { id: "oppo", name: "Oppo", logo: "/brand/oppo.jpg" },
        { id: "realme", name: "Realme", logo: "/brand/realme.jpg" },
        // { id: "huawei", name: "Huawei", logo: "/brand/Huawei.jpg" },
        // { id: "honor", name: "Honor", logo: "/brand/Honor.jpg" },
        { id: "tecno", name: "Tecno", logo: "/brand/Tecno.jpg" },
        { id: "infinix", name: "Infinix", logo: "/brand/Infinix.jpg" },
        // { id: "motorola", name: "Motorola", logo: "/brand/Motorola.jpg" },
        // { id: "pixel", name: "Pixel", logo: "/brand/googlepixel.jpg" },
        // { id: "redmagic", name: "Red magic", logo: "/brand/redmagic.jpg" },
      
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
        <div className="w-full bg-red-500 py-10 my-10 relative group overflow-hidden">
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
                    <ChevronLeft size={24} className="text-slate-500" />
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
                                        ? "bg-white shadow-lg ring-4 ring-white/50 "
                                        : "bg-white shadow-md hover:bg-white"
                                    }
                        `}
                            >
                                <div className="md:w-28 md:h-28 h-14 w-14 flex items-center justify-center">
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className={`
                                    max-w-full max-h-full object-contain transition-all duration-500
                                   
                                `}
                                    />
                                </div>
                            </motion.div>

                            <span className={`
                        text-[9px] md:text-lg font-black uppercase tracking-widest transition-all
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
                    <ChevronRight size={24} className="text-slate-500" />
                </button>

            </div>
        </div>
    );
}