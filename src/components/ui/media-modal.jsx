"use client";
import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.5,
};

export function MediaModal({ imgSrc, videoSrc }) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const uniqueId = useId();

  useEffect(() => {
    if (isMediaModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMediaModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMediaModalOpen]);

  return (
    <MotionConfig transition={transition}>
      {/* Trigger / Thumbnail */}
      <motion.div
       
        className="w-full h-full aspect-video flex relative flex-col overflow-hidden border cursor-zoom-in dark:bg-neutral-800 bg-neutral-300 rounded-xl"
        layoutId={`dialog-${uniqueId}`}
        onClick={() => setIsMediaModalOpen(true)}
      >
        {imgSrc && (
          <motion.div layoutId={`dialog-img-${uniqueId}`} className="w-full h-full">
            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
        {videoSrc && (
          <motion.div layoutId={`dialog-video-${uniqueId}`} className="w-full h-full">
            <video autoPlay muted loop className="h-full w-full  object-contain">
              <source src={videoSrc} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </motion.div>

     
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isMediaModalOpen && (
          <>
            <motion.div
              key={`backdrop-${uniqueId}`}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" // Lebih gelap agar fokus
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMediaModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none p-4"> {/* Tambah p-4 agar tidak nempel layar */}
              <motion.div
                layoutId={`dialog-${uniqueId}`}
                className={cn(
                  "pointer-events-auto relative flex flex-col overflow-hidden bg-white dark:bg-neutral-950 border",
                  "w-full max-w-[95%] md:max-w-[80%]", // Lebar maksimal
                  "h-auto max-h-[80vh] md:max-h-[90vh]", // Tinggi mengikuti konten, maksimal 80% layar
                  "rounded-2xl md:rounded-[32px]"
                )}
              >
                {imgSrc && (
                  <motion.div
                    layoutId={`dialog-img-${uniqueId}`}
                    className="w-full flex items-center justify-center bg-black"
                    onClick={() => setIsMediaModalOpen(false)}
                  >
                    <img src={imgSrc} alt="" className="w-full h-auto object-contain" />
                  </motion.div>
                )}

                {videoSrc && (
                  <motion.div
                    layoutId={`dialog-video-${uniqueId}`}
                    className="w-full h-full bg-black flex items-center justify-center"
                  >
                    <video
                      autoPlay
                      muted
                      loop
                      controls
                      className="w-full h-auto max-h-full object-contain"
                    >
                      <source src={videoSrc} type="video/mp4" />
                    </video>

                    <button
                      onClick={() => setIsMediaModalOpen(false)}
                      className="absolute right-3 top-3 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                    >
                      <XIcon size={18} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}