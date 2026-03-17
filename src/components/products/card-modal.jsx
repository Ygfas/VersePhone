'use client'
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DialogContent,
  DialogTitle,
  DialogImage,
  DialogClose,
  DialogDescription,
  DialogContainer,
} from '@/components/ui/dialog';

export default function CardItems({ item }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // HAPUS bagian body overflow hidden di sini agar tidak mengunci scroll saat page load
  }, []);

  if (!item || !isClient) return null;

  // Definisikan varian animasi
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring", stiffness: 260, damping: 28, staggerChildren: 0.08, delayChildren: 0.1 }
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const modalContent = (
    <DialogContainer>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[9998]"
      />

      <DialogContent
        style={{ borderRadius: '32px', zIndex: '99999' }}
        className="pointer-events-auto relative flex h-auto w-full max-w-[90vw] flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 sm:max-w-[500px] border border-white/20"
      >
        <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col w-full">
          <motion.div variants={itemVariants} className="relative flex w-full items-center justify-center bg-slate-50 p-10 dark:bg-slate-800/50">
            <DialogImage src={item.image} alt={item.title} className="max-h-[280px] w-auto object-contain sm:max-h-[340px] drop-shadow-2xl" />
          </motion.div>

          <div className="p-8">
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{item.title}</DialogTitle>
              <div className="mt-2 inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">{item.subtitle}</div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6">
              <DialogDescription disableLayoutAnimation className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</DialogDescription>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <button className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-black active:scale-[0.98] dark:bg-white dark:text-black">Beli Sekarang</button>
            </motion.div>
          </div>
        </motion.div>
        <DialogClose className="absolute right-6 top-6 rounded-full bg-white/90 p-2 text-slate-500 shadow-md transition-all hover:scale-110 active:scale-95 dark:bg-slate-800/90 dark:text-slate-300" />
      </DialogContent>
    </DialogContainer>
  );

  return createPortal(modalContent, document.body);
}