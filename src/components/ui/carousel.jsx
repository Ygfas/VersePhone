'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';

export const items = [
    // ... data items Anda tetap sama
    { id: 6, url: 'https://images.unsplash.com/photo-1760389005000-bf02bf24f463?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1123', title: 'DONM FLY' },
    { id: 5, url: 'https://images.unsplash.com/photo-1761078980679-e89e25fe279b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', title: 'SONYPOO' },
    { id: 3, url: 'https://images.unsplash.com/photo-1761882725885-d3d8bd2032d1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', title: 'AUSIZE MAM' },
    { id: 4, url: 'https://images.unsplash.com/photo-1761775915848-467e41c1c4db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=689', title: 'RECLKTIKA' },
    { id: 1, url: 'https://images.unsplash.com/photo-1761882835101-02ab45ac0726?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=690', title: 'MAXX PHAM' },
    { id: 2, url: 'https://images.unsplash.com/photo-1661980494567-40a5e01b699b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=685', title: 'BOXIEN BAY' },
    { id: 7, url: 'https://images.unsplash.com/photo-1761165307495-56bd564d322f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=663', title: 'Snowy Mountain Highway' },
    { id: 8, url: 'https://images.unsplash.com/photo-1756299792672-157811bf1005?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074', title: 'FOGGY FOLS' },
    { id: 9, url: 'https://images.unsplash.com/photo-1572851899646-a1f69c664e1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170', title: 'DIM DARKO' },
    { id: 10, url: 'https://images.unsplash.com/photo-1759247178379-0e8eba83a4a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', title: 'BEALIVE' },
    { id: 11, url: 'https://images.unsplash.com/photo-1754968230523-052635c98f99?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=736', title: 'DOMEDOM ROME' },
    { id: 12, url: 'https://images.unsplash.com/photo-1643037508102-46fb319979c5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764', title: 'IKEIMON POVE' },
];

export default function FramerDraggableCarousel() {
    const [index, setIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const x = useMotionValue(0);
    useEffect(() => {
        // Jangan jalankan auto-scroll jika sedang di-drag
        if (isDragging) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => {
                // Jika sudah sampai di item terakhir, balik ke awal (loop)
                // Atau gunakan: Math.min(prevIndex + 1, items.length - 1) jika tidak ingin loop
                return prevIndex === items.length - 1 ? 0 : prevIndex + 1;
            });
        }, 5000); // 5000ms = 5 detik

        // Bersihkan interval saat komponen di-unmount atau saat isDragging berubah
        return () => clearInterval(interval);
    }, [isDragging, items.length]);
    
    useEffect(() => {
        if (!isDragging && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth || 1;
            const targetX = -index * containerWidth;
            animate(x, targetX, {
                type: 'spring',
                stiffness: 250, // Sedikit lebih lembut untuk mobile
                damping: 30,
            });
        }
    }, [index, x, isDragging]);

    return (
        <div className="w-full max-w-4xl mx-auto ">
            <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-lg" ref={containerRef}>
                    <motion.div
                        className="flex cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={containerRef} // Tambahkan batas agar tidak over-drag berlebihan
                        dragElastic={0.2}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(e, info) => {
                            setIsDragging(false);
                            const containerWidth = containerRef.current?.offsetWidth || 1;
                            const { offset, velocity } = info;

                            // Logic geser: Sensitivitas swipe ditingkatkan untuk mobile
                            if (velocity.x < -400 || offset.x < -containerWidth / 4) {
                                setIndex((prev) => Math.min(items.length - 1, prev + 1));
                            } else if (velocity.x > 400 || offset.x > containerWidth / 4) {
                                setIndex((prev) => Math.max(0, prev - 1));
                            }
                        }}
                        style={{ x }}
                    >
                        {items.map((item) => (
                            <div key={item.id} className="shrink-0 w-full h-[400px]">
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded-lg select-none pointer-events-none"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Tombol Kiri - Hidden di mobile (hidden), muncul di md ke atas (md:flex) */}
                    <motion.button
                        disabled={index === 0}
                        onClick={() => setIndex((i) => Math.max(0, i - 1))}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-lg transition-transform z-10 hidden md:flex
              ${index === 0
                                ? 'opacity-40 cursor-not-allowed'
                                : 'bg-white hover:scale-110 hover:opacity-100 opacity-70'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>

                    {/* Tombol Kanan - Hidden di mobile (hidden), muncul di md ke atas (md:flex) */}
                    <motion.button
                        disabled={index === items.length - 1}
                        onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-lg transition-transform z-10 hidden md:flex
              ${index === items.length - 1
                                ? 'opacity-40 cursor-not-allowed'
                                : 'bg-white hover:scale-110 hover:opacity-100 opacity-70'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>

                    {/* Indikator Dot tetap muncul di mobile untuk bantuan visual */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {items.map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => setIndex(i)}
                                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}