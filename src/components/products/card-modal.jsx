'use client'
import { useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogImage,
  DialogClose,
  DialogDescription,
  DialogContainer,
} from '@/components/ui/dialog'; // ← same correct source

// Komponen ini menerima data 'item' sebagai props
export default function CardItems({ item }) {
  if (!item) return null;
  useEffect(() => {
    // Matikan scroll saat modal muncul
    document.body.style.overflow = 'hidden';

    // Kembalikan scroll saat modal ditutup (unmounted)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <DialogContainer>
      <DialogContent
        style={{ borderRadius: '24px' }}
        className="pointer-events-auto relative flex h-auto w-full max-w-[90vw] flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-800 sm:max-w-[500px] "
      >
        {/* Container Gambar Modal yang disesuaikan ukurannya */}
        <div className="relative flex w-full items-center justify-center bg-gray-50 p-8 dark:bg-slate-900/50">
          <DialogImage
            src={item.image}
            alt={item.title}
            className="max-h-[250px] w-auto object-contain sm:max-h-[320px]"
          />
        </div>

        <div className="p-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-neutral-50">
            {item.title}
          </DialogTitle>
          <div className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {item.subtitle}
          </div>

          <DialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 20 },
            }}
            className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-neutral-400"
          >
            {item.description}
          </DialogDescription>

          <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            Beli Sekarang
          </button>
        </div>

        <DialogClose className="absolute right-4 top-4 rounded-full bg-black/10 p-2 text-gray-500 backdrop-blur-md transition-colors hover:bg-black/20 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20" />
      </DialogContent>
    </DialogContainer>
  )
}