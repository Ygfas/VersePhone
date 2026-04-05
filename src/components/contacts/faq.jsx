'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
const tabs = [
    {
        title: 'Mengapa website VersePhone sering mengalami loading lama saat diakses?',
        description:
            'Website VersePhone sering mengalami loading lama karena server overload, kurangnya optimasi sistem, dan ukuran konten seperti gambar yang terlalu besar.',
    },
    {
        title: 'Apa penyebab pengguna gagal login ke akun mereka di VersePhone?',
        description:
            'Pengguna gagal login ke akun mereka di VersePhone karena adanya bug pada sistem autentikasi, server yang tidak stabil, atau kesalahan dalam pengolahan data login.',
    },
    {
        title: 'Mengapa proses checkout di VersePhone sering gagal dilakukan pengguna?',
        description:
            'Proses checkout di VersePhone sering gagal karena adanya masalah pada sistem pembayaran, integrasi payment gateway yang tidak stabil, atau error pada validasi data.',
    },
    {
        title: 'Mengapa informasi produk di VersePhone sering dianggap kurang lengkap?',
        description:
            'Informasi produk di VersePhone sering dianggap kurang lengkap karena deskripsi yang tidak detail, spesifikasi yang minim, dan gambar produk yang kurang jelas.',
    },
    {
        title: 'Mengapa produk yang diterima pengguna tidak sesuai dengan yang ditampilkan di website VersePhone?',
        description:
            'Produk yang diterima pengguna tidak sesuai dengan yang ditampilkan di website VersePhone karena kesalahan input data, kurangnya validasi produk, atau perbedaan dari pihak supplier.',
    },
    {
        title: 'Apa penyebab pengiriman produk dari VersePhone menjadi lambat?',
        description:
            'Pengiriman produk dari VersePhone menjadi lambat karena kendala pada logistik, stok barang yang tidak siap, atau sistem tracking yang tidak real-time.',
    },
    {
        title: 'Mengapa pengguna merasa kesulitan dalam menggunakan website VersePhone?',
        description:
            'Pengguna merasa kesulitan dalam menggunakan website VersePhone karena tampilan yang tidak intuitif, menu yang kompleks, dan desain yang kurang responsif.',
    },
    {
        title: 'Apakah data pengguna di website VersePhone aman?',
        description:
            'Data pengguna di website VersePhone aman jika sistem menggunakan enkripsi, protokol HTTPS, dan perlindungan keamanan yang memadai.',
    },
    {
        title: 'Mengapa harga produk di VersePhone berubah saat proses checkout?',
        description:
            'Harga produk di VersePhone berubah saat proses checkout karena adanya bug sistem, promo yang tidak sinkron, atau keterlambatan pembaruan database.',
    },
    {
        title: 'Mengapa customer service VersePhone sulit dihubungi atau lambat merespon?',
        description:
            'Customer service VersePhone sulit dihubungi atau lambat merespon karena keterbatasan tim support, tidak adanya sistem otomatis, atau manajemen layanan yang kurang optimal.',
    },

];
function SingleLayout() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeItem, setActiveItem] = useState(tabs[0]);
    const handleClick = async (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        const newActiveItem = tabs.find((_, i) => i === index);
        setActiveItem(newActiveItem);
    };
    return (
        <>
            <div className="container mx-auto pb-10 pt-2">
                <h1 className="uppercase text-center text-4xl font-bold pt-2 pb-4">
                    FAQ
                </h1>
                <div className="h-fit border-2  rounded-lg p-2 dark:bg-[#111111] bg-[#F2F2F2]">
                    {tabs.map((tab, index) => (
                        <motion.div
                            key={tab.title}
                            className={`overflow-hidden ${index !== tabs.length - 1 ? 'border-b' : ''}`}
                            onClick={() => handleClick(index)}
                        >
                            <button
                                className={`p-3 px-2 w-full cursor-pointer sm:text-base text-xs items-center transition-all font-semibold dark:text-white text-black   flex gap-2 
               `}
                            >
                                <Plus
                                    className={`${activeIndex === index ? 'rotate-45' : 'rotate-0 '} transition-transform ease-in-out w-5 h-5  dark:text-neutral-200 text-neutral-600`}
                                />
                                {tab.title}
                            </button>
                            <AnimatePresence mode="sync">
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: 'easeInOut',
                                            delay: 0.14,
                                        }}
                                    >
                                        <p
                                            className={`dark:text-white text-black p-3 xl:text-base sm:text-sm text-xs pt-0 w-[90%]`}
                                        >
                                            {tab.description}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}
export default SingleLayout;
