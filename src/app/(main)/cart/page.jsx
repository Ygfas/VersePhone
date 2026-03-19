"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_CART = [
    { id: 1, name: "X300 Pro", price: 8500000, image: "/test2.png", qty: 2, checked: false },
    { id: 2, name: "Y05", price: 2100000, image: "/test1.png", qty: 1, checked: false },
    { id: 3, name: "V60 Lite", price: 3200000, image: "/test1.png", qty: 1, checked: false },
    { id: 4, name: "V60 Pro Plus", price: 12000000, image: "/test1.png", qty: 1, checked: false },
];

export default function CartPage() {
    const [cart, setCart] = useState(INITIAL_CART);
    const [notification, setNotification] = useState(null);

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty === 0) {
                    showNotif("Klik ikon sampah untuk menghapus item");
                    return item;
                }
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const toggleCheck = (id) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const totalHarga = useMemo(() => {
        return cart.filter(item => item.checked).reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    }, [cart]);

    return (
        <div className="relative h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col overflow-hidden">

            {/* 1. Header & List Area (Full Width) */}
            <div className="flex-1 overflow-y-auto pt-32 pb-48 custom-scrollbar">
                {/* Container Utama menggunakan w-full tanpa max-width agar full layar */}
                <div className="w-full px-4 sm:px-10 lg:px-20">

                    <div className="flex justify-between items-end mb-10">
                        <h1 className="text-5xl font-black tracking-tighter">Keranjang Anda</h1>
                        <button onClick={() => setCart([])} className="text-red-500 font-bold bg-red-50 hover:bg-red-100 px-6 py-3 rounded-full transition-all">
                            Bersihkan Semua
                        </button>
                    </div>

                    {cart.length > 0 ? (
                        <div className="space-y-6">
                            {/* Select All Bar - Full Width */}
                            <div className="bg-white dark:bg-neutral-900 p-8 rounded-[35px] flex items-center gap-6 border border-neutral-100 shadow-sm">
                                <input
                                    type="checkbox"
                                    className="w-8 h-8 accent-blue-600 cursor-pointer"
                                    checked={cart.length > 0 && cart.every(i => i.checked)}
                                    onChange={() => {
                                        const allChecked = cart.every(i => i.checked);
                                        setCart(cart.map(i => ({ ...i, checked: !allChecked })));
                                    }}
                                />
                                <span className="font-black text-2xl tracking-tight">Pilih Semua ({cart.length} Item)</span>
                            </div>

                            {/* Items List */}
                            <AnimatePresence mode="popLayout">
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        // justify-between akan mendorong konten ke ujung kiri dan kanan
                                        className="bg-white dark:bg-neutral-900 p-10 rounded-[45px] border border-neutral-100 shadow-sm flex items-center justify-between group transition-all hover:shadow-md"
                                    >
                                        {/* SEKTOR KIRI: Menempel ke Kiri Layar */}
                                        <div className="flex items-center gap-10">
                                            <input
                                                type="checkbox"
                                                className="w-8 h-8 accent-blue-600 cursor-pointer"
                                                checked={item.checked}
                                                onChange={() => toggleCheck(item.id)}
                                            />
                                            <div className="w-40 h-40 bg-neutral-50 dark:bg-neutral-800 rounded-[35px] p-6 flex-shrink-0 transition-transform group-hover:scale-105">
                                                <img src={item.image} alt="" className="w-full h-full object-contain drop-shadow-xl" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-4xl font-black tracking-tighter leading-tight">{item.name}</h3>
                                                <p className="text-blue-600 font-black text-2xl">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>

                                        {/* SEKTOR KANAN: Menempel ke Kanan Layar */}
                                        <div className="flex items-center gap-12">
                                            <div className="flex items-center gap-8 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-[30px] border border-neutral-200/50">
                                                <button onClick={() => updateQty(item.id, -1)} className="p-3 bg-white dark:bg-neutral-700 rounded-2xl shadow-sm hover:text-blue-600 transition-all active:scale-90">
                                                    <Minus size={24} strokeWidth={3} />
                                                </button>
                                                <span className="font-black text-4xl w-14 text-center tracking-tighter">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="p-3 bg-white dark:bg-neutral-700 rounded-2xl shadow-sm hover:text-blue-600 transition-all active:scale-90">
                                                    <Plus size={24} strokeWidth={3} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setCart(cart.filter(i => i.id !== item.id))}
                                                className="text-neutral-300 hover:text-red-500 transition-all p-4 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 size={36} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-40">
                            <ShoppingBag size={150} className="mx-auto text-neutral-200 mb-10" />
                            <h2 className="text-5xl font-black tracking-tighter text-neutral-400">Keranjang kosong</h2>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Floating Footer (Full Width Horizontal) */}
            {cart.length > 0 && (
                <div className="fixed bottom-4 sm:bottom-10 inset-x-0 z-[50] flex justify-center px-4 sm:px-10 pointer-events-none">
                    <motion.div
                        initial={{ y: 120, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={cn(
                            "w-full max-w-[1600px] bg-neutral-900 dark:bg-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 pointer-events-auto",
                            // Mobile: Padding kecil, rounded lebih kecil, flex-col
                            "p-5 rounded-[35px] flex flex-col gap-4",
                            // Desktop (sm+): Padding besar, rounded besar, flex-row (menyamping)
                            "sm:p-8 sm:rounded-[55px] sm:flex-row sm:items-center sm:justify-between sm:gap-0"
                        )}
                    >
                        {/* Bagian Info Harga */}
                        <div className="pl-2 sm:pl-10">
                            <p className="text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2">
                                Estimasi Total
                            </p>
                            <h2 className="text-white dark:text-black text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter">
                                Rp {totalHarga.toLocaleString('id-ID')}
                            </h2>
                        </div>

                        {/* Bagian Tombol Checkout */}
                        <button className={cn(
                            "bg-blue-600 hover:bg-blue-700 text-white font-black transition-all active:scale-95 shadow-2xl shadow-blue-500/40",
                            // Mobile: Tombol full width, text sedang, padding kecil
                            "w-full sm:w-auto px-8 py-4 sm:py-8 sm:px-20 rounded-[25px] sm:rounded-[40px] text-lg sm:text-2xl"
                        )}>
                            Checkout Sekarang
                        </button>
                    </motion.div>
                </div>
            )}

            {/* 3. Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ y: -100, x: "-50%" }} animate={{ y: 40, x: "-50%" }} exit={{ y: -100, x: "-50%" }}
                        className="fixed top-0 left-1/2 z-[100] bg-white dark:bg-neutral-900 border-4 border-red-500 px-12 py-6 rounded-[35px] shadow-2xl flex items-center gap-6 text-red-500 font-black text-2xl"
                    >
                        <AlertCircle size={32} /> {notification}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}