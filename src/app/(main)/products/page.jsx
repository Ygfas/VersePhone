'use client'
import FloatingSearch from "@/components/ui/floating-search"
import FilterItems from "@/components/ui/filter-items"
import { motion } from "framer-motion"
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import CardItems from "@/components/products/card-modal"

const items = [
    {
        id: 1,
        image: '/test1.png',
        title: 'VIVO Y21',
        subtitle: 'Harga Jual',
        description: 'VIVO Y21 hadir dengan desain elegan dan performa handal...',
    },
    {
        id: 2,
        image: '/test1.png',
        title: 'VIVO Y21',
        subtitle: 'Harga Jual',
        description: 'VIVO Y21 hadir dengan desain elegan dan performa handal...',
    },
    {
        id: 3,
        image: '/test1.png',
        title: 'VIVO Y21',
        subtitle: 'Harga Jual',
        description: 'VIVO Y21 hadir dengan desain elegan dan performa handal...',
    },
    {
        id: 4,
        image: '/test1.png',
        title: 'VIVO Y21',
        subtitle: 'Harga Jual',
        description: 'VIVO Y21 hadir dengan desain elegan dan performa handal...',
    },
    
    // ... item lainnya
];

const transition = {
    type: 'spring',
    bounce: 0.05,
    duration: 0.3,
};

export default function Products() {
    return (
        <div className="relative min-h-screen bg-[#F8FAFC]">
            <FloatingSearch />

            <div className="pt-10 pb-24 lg:px-20 bg-slate-100/50 dark:bg-slate-900">
                <FilterItems />

                {/* Gunakan Framer Motion untuk grid agar muncul satu per satu saat page load */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 xl:grid-cols-3 gap-8 mx-12 mt-10"
                >
                    {items.map((item, index) => (
                        <Dialog key={item.id}>
                            <DialogTrigger className="w-full text-left outline-none group">
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="break-inside-avoid bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-[24px] overflow-hidden cursor-pointer"
                                >
                                    <figure className="relative w-full h-auto bg-slate-50 dark:bg-slate-800/50 flex justify-center p-8 overflow-hidden">
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            src={item.image}
                                            alt={item.title}
                                            className="rounded-lg object-contain lg:max-h-[280px] max-h-40 drop-shadow-xl"
                                        />
                                    </figure>

                                    <div className="p-8">
                                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{item.title}</h1>
                                        <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1">{item.subtitle}</h2>
                                    </div>
                                </motion.div>
                            </DialogTrigger>

                            <CardItems item={item} />
                        </Dialog>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}