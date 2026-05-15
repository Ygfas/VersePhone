'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence, MotionConfig } from 'motion/react';
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const items = [
    { id: 6, url: '/thumbnail/ip1.jpg', title: 'ip' },
    { id: 5, url: '/thumbnail/xiaomi.jpg', title: 'xiaomi' },
    { id: 3, url: '/thumbnail/vivo1.jpg', title: 'vivio' },
    { id: 4, url: '/thumbnail/iqoo1.jpg', title: 'iqoo' },
    { id: 1, url: '/thumbnail/samsung.jpg', title: 'samsung' },
    { id: 2, url: '/thumbnail/oppo1.jpg', title: 'oppo' },
    { id: 7, url: '/thumbnail/infinix1.jpg', title: 'Snowy Mountain Highway' },
];

export const transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.5,
};

export default function FramerDraggableCarousel() {
    const [index, setIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const containerRef = useRef(null);
    const x = useMotionValue(0);

    // Auto-scroll logic
    useEffect(() => {
        if (isDragging || selectedImg) return;
        const interval = setInterval(() => {
            setIndex((prevIndex) => prevIndex === items.length - 1 ? 0 : prevIndex + 1);
        }, 8000);
        return () => clearInterval(interval);
    }, [isDragging, selectedImg]);

    // Spring animation for carousel
    useEffect(() => {
        if (!isDragging && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth || 1;
            const targetX = -index * containerWidth;
            animate(x, targetX, {
                type: 'spring',
                stiffness: 250,
                damping: 30,
            });
        }
    }, [index, x, isDragging]);

    // Handle Escape key & Scroll Lock
    useEffect(() => {
        if (selectedImg) {
            document.body.classList.add("overflow-hidden");
            const handleKeyDown = (e) => { if (e.key === "Escape") setSelectedImg(null); };
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.body.classList.remove("overflow-hidden");
            };
        }
    }, [selectedImg]);

    return (
        <MotionConfig transition={transition}>
            <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
                <div className="flex flex-col gap-3">
                    <div className="relative overflow-hidden rounded-xl bg-slate-200 dark:bg-zinc-900 transition-colors duration-300" ref={containerRef}>
                        <motion.div
                            className="flex cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={(e, info) => {
                                setIsDragging(false);
                                const containerWidth = containerRef.current?.offsetWidth || 1;
                                const { offset, velocity } = info;
                                if (velocity.x < -400 || offset.x < -containerWidth / 4) {
                                    setIndex((prev) => Math.min(items.length - 1, prev + 1));
                                } else if (velocity.x > 400 || offset.x > containerWidth / 4) {
                                    setIndex((prev) => Math.max(0, prev - 1));
                                }
                            }}
                            style={{ x }}
                        >
                            {items.map((item) => (
                                <div key={item.id} className="shrink-0 w-full h-[350px] md:h-[600px] flex items-center justify-center overflow-hidden">
                                    <motion.div
                                        layoutId={`img-container-${item.id}`}
                                        className="w-full h-full cursor-zoom-in"
                                        onClick={() => !isDragging && setSelectedImg(item)}
                                    >
                                        <motion.img
                                            layoutId={`img-${item.id}`}
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-contain select-none pointer-events-none"
                                            draggable={false}
                                        />
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Navigation Buttons */}
                        <motion.button
                            disabled={index === 0}
                            onClick={() => setIndex((i) => Math.max(0, i - 1))}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-lg transition-all z-10 hidden md:flex ${index === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-white hover:scale-110'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </motion.button>

                        <motion.button
                            disabled={index === items.length - 1}
                            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-lg transition-all z-10 hidden md:flex ${index === items.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-white/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-white hover:scale-110'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </motion.button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-sm">
                            {items.map((_, i) => (
                                <button key={`dot-${i}`} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-zinc-800 dark:bg-white' : 'w-2 bg-zinc-400 dark:bg-white/40'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* MODAL FULL SCREEN */}
                <AnimatePresence>
                    {selectedImg && (
                        <>
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedImg(null)}
                                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm cursor-zoom-out"
                            />
                            <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none p-4">
                                <motion.div
                                    layoutId={`img-container-${selectedImg.id}`}
                                    className={cn(
                                        "pointer-events-auto relative flex flex-col overflow-hidden bg-white dark:bg-neutral-950 border shadow-2xl",
                                        "w-full max-w-[95%] md:max-w-[80%] h-auto max-h-[85vh] rounded-2xl md:rounded-[32px]"
                                    )}
                                >
                                    <motion.div
                                        layoutId={`img-${selectedImg.id}`}
                                        className="w-full flex items-center justify-center bg-black overflow-hidden"
                                        onClick={() => setSelectedImg(null)}
                                    >
                                        <img src={selectedImg.url} alt={selectedImg.title} className="w-full h-auto max-h-[85vh] object-contain cursor-zoom-out" />
                                    </motion.div>

                                    <button
                                        onClick={() => setSelectedImg(null)}
                                        className="absolute right-4 top-4 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                    >
                                        <XIcon size={20} />
                                    </button>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </MotionConfig>
    );
}