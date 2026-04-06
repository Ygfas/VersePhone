'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

// --- DATA AWAL (Disimpan di luar komponen agar rapi) ---
export const INITIAL_CART = [
    {
        id: 1,
        name: "X300 Pro",
        basePrice: 8000000,
        price: 8500000,
        image: "/test2.png",
        qty: 2,
        checked: false,
        selectedColor: 'Phantom Black',
        selectedStorage: '256GB',
        selectedRam: '12GB',
        options: {
            colors: ['Phantom Black', 'Ice Blue', 'Deep Red'],
            variants: [
                { ram: '8GB', storage: '128GB', extra: 0 },
                { ram: '12GB', storage: '256GB', extra: 500000 },
                { ram: '12GB', storage: '512GB', extra: 1500000 },
            ]
        }
    },
    {
        id: 2,
        name: "Y05",
        basePrice: 1900000,
        price: 2100000,
        image: "/test1.png",
        qty: 1,
        checked: false,
        selectedColor: 'Glowing White',
        selectedStorage: '128GB',
        selectedRam: '4GB',
        options: {
            colors: ['Glowing White', 'Midnight Blue'],
            variants: [
                { ram: '4GB', storage: '64GB', extra: 0 },
                { ram: '4GB', storage: '128GB', extra: 200000 },
            ]
        }
    },
];

export default function CartComponent() {
    // State untuk mengelola data yang bisa berubah
    const [cart, setCart] = useState(INITIAL_CART);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // --- LOGIKA FUNGSI ---

    const updateVariant = (id, ram, storage, extra) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    selectedRam: ram,
                    selectedStorage: storage,
                    price: item.basePrice + extra
                };
            }
            return item;
        }));
    };

    const updateColor = (id, color) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, selectedColor: color } : item));
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty <= 0) {
                    setDeleteConfirm(item);
                    return item;
                }
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const confirmDelete = () => {
        setCart(prev => prev.filter(i => i.id !== deleteConfirm.id));
        setDeleteConfirm(null);
    };


    const totalHarga = cart.filter(i => i.checked).reduce((acc, i) => acc + (i.price * i.qty), 0);

    return (
        <div className="relative h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col overflow-hidden font-sans">
            <div className="flex-1 overflow-y-auto pt-10 sm:pt-32 pb-48 custom-scrollbar">
                <div className="w-full px-4 sm:px-10 lg:px-20">
                    <div className="flex justify-between items-center mb-6 sm:mb-10">
                        <h1 className="text-2xl p-5 sm:text-5xl font-black tracking-tighter">Keranjang Anda</h1>
                        <button onClick={() => setCart([])} className="text-red-500 gap-2 flex justify-center font-bold text-md bg-red-50 hover:bg-red-100 px-5 py-2 rounded-full transition-all">
                            Bersihkan<Trash2 className='text-sm w-5 h-5'></Trash2>
                        </button>
                    </div>

                    {cart.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Select All Bar */}
                            <div className="bg-white dark:bg-neutral-900 p-5 rounded-[25px] flex items-center gap-4 border border-neutral-400 shadow-sm">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 accent-blue-600 cursor-pointer"
                                    checked={cart.length > 0 && cart.every(i => i.checked)}
                                    onChange={() => {
                                        const allChecked = cart.every(i => i.checked);
                                        setCart(cart.map(i => ({ ...i, checked: !allChecked })));
                                    }}
                                />
                                <span className="font-bold text-lg tracking-tight">Pilih Semua ({cart.length})</span>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white dark:bg-neutral-900 p-4 sm:p-8 rounded-[35px] border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center justify-between gap-3 sm:gap-8 group"
                                    >
                                        {/* KOLOM 1: Checkbox + Gambar */}
                                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 sm:w-6 sm:h-6 accent-blue-600 cursor-pointer flex-shrink-0"
                                                checked={item.checked}
                                                onChange={() => setCart(cart.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i))}
                                            />
                                            <div className="w-16 h-16 sm:w-44 sm:h-44 bg-neutral-50 dark:bg-neutral-800 rounded-2xl sm:rounded-[25px] p-2 sm:p-3 flex-shrink-0 transition-transform group-hover:scale-105">
                                                <img src={item.image} alt="" className="w-full h-full object-contain drop-shadow-lg" />
                                            </div>
                                        </div>

                                        {/* KOLOM 2: Info Produk */}
                                        <div className="flex flex-col gap-1 sm:gap-3 flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-4xl font-black tracking-tighter truncate leading-tight">
                                                {item.name}
                                            </h3>

                                            <div className="relative w-fit">
                                                <select
                                                    value={item.selectedColor}
                                                    onChange={(e) => updateColor(item.id, e.target.value)}
                                                    className="appearance-none bg-neutral-200 dark:bg-neutral-800 text-[10px] sm:text-xs font-bold py-1 pl-2.5 pr-6 rounded-sm border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                >
                                                    {item.options.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-neutral-400 pointer-events-none" />
                                            </div>

                                            <div className="relative w-fit">
                                                <select
                                                    value={`${item.selectedRam}/${item.selectedStorage}`}
                                                    onChange={(e) => {
                                                        const [ram, storage] = e.target.value.split('/');
                                                        const variant = item.options.variants.find(v => v.ram === ram && v.storage === storage);
                                                        updateVariant(item.id, ram, storage, variant.extra);
                                                    }}
                                                    className="appearance-none bg-neutral-200 dark:bg-neutral-800 text-[10px] sm:text-xs font-black py-1 pl-2.5 pr-6 rounded-sm border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                >
                                                    {item.options.variants.map(v => (
                                                        <option key={`${v.ram}-${v.storage}`} value={`${v.ram}/${v.storage}`}>
                                                            {v.ram}/{v.storage}{v.extra > 0 ? ` (+Rp ${v.extra.toLocaleString()})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-neutral-400 pointer-events-none" />
                                            </div>

                                            <p className="text-blue-600 font-black text-sm sm:text-3xl">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {/* KOLOM 3: Stepper */}
                                        <div className="flex-shrink-0">
                                            <div className="flex flex-row items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl gap-1 sm:gap-2 border border-neutral-200/50 dark:border-neutral-700/50">
                                                <button
                                                    onClick={() => updateQty(item.id, -1)}
                                                    className="p-1.5 sm:p-2 bg-white dark:bg-neutral-700 rounded-xl shadow-sm hover:text-red-500 transition-all active:scale-75"
                                                >
                                                    <Minus className="w-3 h-3 sm:w-5 sm:h-5" strokeWidth={3} />
                                                </button>

                                                <div className="w-6 sm:w-8 text-center font-black text-xs sm:text-xl overflow-hidden">
                                                    <AnimatePresence mode="wait">
                                                        <motion.span
                                                            key={item.qty}
                                                            initial={{ y: 10, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: -10, opacity: 0 }}
                                                            transition={{ duration: 0.1 }}
                                                            className="block"
                                                        >
                                                            {item.qty}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                </div>

                                                <button
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="p-1.5 sm:p-2 bg-white dark:bg-neutral-700 rounded-xl shadow-sm hover:text-blue-600 transition-all active:scale-75"
                                                >
                                                    <Plus className="w-3 h-3 sm:w-5 sm:h-5" strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-40">
                            <ShoppingBag size={100} className="mx-auto text-neutral-200 mb-10" />
                            <h2 className="text-3xl font-black tracking-tighter text-neutral-400">Keranjang kosong</h2>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Summary */}
            <div className="fixed bottom-0 z-1000 border-t-2 left-0 right-0 bg-white dark:bg-neutral-900/80 backdrop-blur-xl border-neutral-200 dark:border-neutral-800 p-6 sm:p-4 z-50">
                <div className="px-6 sm:px-10 flex items-center justify-between gap-10">
                    <div className="hidden sm:block">
                        <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs mb-1">Total Pembayaran</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter text-blue-600">
                                Rp {totalHarga.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 sm:flex-none w-full sm:w-auto">
                        <div className="sm:hidden flex justify-between items-center mb-4 px-2">
                            <span className="font-bold text-neutral-500 uppercase text-xs tracking-widest">Total</span>
                            <span className="font-black text-2xl text-blue-600">Rp {totalHarga.toLocaleString('id-ID')}</span>
                        </div>
                        <Link href={'/payment'}>
                        <button className="w-full sm:w-[400px] py-5 sm:py-8 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-[28px] sm:rounded-[40px] font-black text-xl sm:text-3xl shadow-2xl shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group">
                            <span>Checkout Sekarang</span>
                            <div className="hidden sm:flex w-10 h-10 bg-blue-600 rounded-full items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </div>
                        </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Custom Alert Hapus */}
            <AnimatePresence>
                {deleteConfirm && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setDeleteConfirm(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-neutral-900 p-8 rounded-[40px] z-[101] border-4 border-neutral-100 shadow-2xl text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={40} /></div>
                            <h3 className="text-2xl font-black mb-2 tracking-tighter">Hapus Item?</h3>
                            <p className="text-neutral-500 mb-8 px-4 font-medium">Hapus {deleteConfirm.name} ({deleteConfirm.selectedRam}/{deleteConfirm.selectedStorage})?</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 font-bold bg-neutral-100 rounded-3xl text-black">Batal</button>
                                <button onClick={confirmDelete} className="flex-1 py-4 font-bold bg-red-500 text-white rounded-3xl shadow-lg">Ya, Hapus</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}