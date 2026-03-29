"use client";
import React, { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyBanner = ({
  className,
  children,
  hideOnScroll = false
}) => {
  const [open, setOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false); // State baru untuk tanda sudah di-close
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Jika sudah pernah di-close lewat tombol, jangan lakukan apa-apa lagi
    if (isDismissed) return;

    if (hideOnScroll && latest > 40) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  });

  const handleClose = () => {
    setOpen(false);
    setIsDismissed(true); // Tandai bahwa user sengaja menutupnya
  };

  return (
    <motion.div
      className={cn(
        "sticky inset-x-0 top-0 z-40 flex min-h-20 w-full items-center justify-center bg-transparent px-4 py-3",
        className
      )}
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        // Banner akan hilang jika 'open' false ATAU 'isDismissed' true
        y: open && !isDismissed ? 0 : -100,
        opacity: open && !isDismissed ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}>
      {children}
      <motion.button
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
        onClick={handleClose} // Menggunakan fungsi handleClose baru
      >
        <CloseIcon className="h-5 w-5 text-white" />
      </motion.button>
    </motion.div>
  );
};

const CloseIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};