'use client'
import FloatingSearch from "@/components/ui/floating-search"
import FilterItems from "@/components/ui/filter-items"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogImage,
    DialogClose,
    DialogDescription,
    DialogContainer,
} from '@/components/ui/dialog'; // ← correct source

// CardItems is the default export from card-modal
import CardItems from "@/components/products/card-modal";

const items = [
    {
        id: 1,
        image: '/test1.png',
        title: 'VIVO Y21',
        subtitle: 'Harga Jual',
        description:
            'VIVO Y21 hadir dengan desain elegan dan performa handal untuk kebutuhan sehari-hari. Dibekali layar 6.51 inci HD+, baterai 5000mAh, dan kamera 13MP yang mengabadikan setiap momen dengan jernih. Prosesor MediaTek Helio P35 memastikan multitasking berjalan lancar, sementara memori 4GB RAM dan 64GB ROM memberikan ruang penyimpanan yang lapang.',
    },
    {
        id: 2,
        image: '/test1.png',
        title: 'VIVO V23',
        subtitle: 'Harga Promo',
        description:
            'VIVO V23 memberikan pengalaman fotografi premium dengan dual front camera. Desain yang bisa berubah warna saat terkena sinar matahari memberikan kesan mewah dan futuristik.',
    },
    {
        id: 3,
        image: '/test1.png',
        title: 'VIVO X80',
        subtitle: 'Harga Flagship',
        description:
            'Performa kelas atas dengan optimasi kamera ZEISS. Cocok untuk profesional yang membutuhkan kecepatan dan kualitas visual terbaik dalam satu genggaman.',
    },
];

const transition = {
    type: 'spring',
    bounce: 0.05,
    duration: 0.3,
};

// --- Komponen Utama ---
export default function Products() {
    
    return (
        
            <div className="relative min-h-screen bg-gray-50">
                <FloatingSearch />

                <div className="pt-10 pb-20 lg:px-20 bg-slate-100 dark:bg-slate-900">
                    <FilterItems />
                    <div className="columns-2 xl:columns-3 gap-6 space-y-6 mx-12">

                        {items.map((item) => (
                            <Dialog
                                key={item.id}
                                transition={transition}
                            >
                                <DialogTrigger
                                    className="break-inside-avoid bg-white dark:bg-slate-800 border shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 py-12 w-full cursor-pointer"
                                >
                                    <figure className="relative w-full h-auto bg-gray-50 dark:bg-slate-800 flex justify-center p-2">
                                        <DialogImage
                                            src={item.image}
                                            alt={item.title}
                                            className="rounded-lg object-contain lg:max-h-140 max-h-30"
                                        />
                                    </figure>

                                    <div className="p-6">
                                        <DialogTitle className="flex justify-center mb-2 text-[4vw] lg:text-4xl font-bold text-gray-800 dark:text-neutral-100 text-center">
                                            {item.title}
                                        </DialogTitle>
                                        <h2 className="text-[2vw] lg:text-2xl font-semibold leading-relaxed text-center text-gray-600 dark:text-neutral-400">
                                            {item.subtitle}
                                        </h2>
                                    </div>
                                </DialogTrigger>

                            {/* Panggil CardItems dan teruskan data item */}
                            <CardItems item={item} />
                        </Dialog>
                    ))}
                </div>
            </div>
        </div>
    )
}