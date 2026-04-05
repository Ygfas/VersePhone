"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function ProgressiveBlur({
  className,
  height = "15vh", // Gunakan vh agar lebih konsisten dengan viewport
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64]
}) {
  const divElements = Array(blurLevels.length - 2).fill(null);

  return (
    <div
      className={cn(
        /* Ubah absolute menjadi fixed agar menempel di viewport */
        "gradient-blur pointer-events-none fixed inset-x-0 z-[100]",
        className,
        position === "top" ? "top-0" : position === "bottom" ? "bottom-0" : "inset-y-0"
      )}
      style={{
        height: position === "both" ? "100%" : height,
      }}
    >
      {/* First blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: `linear-gradient(to ${position}, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`,
          WebkitMaskImage: `linear-gradient(to ${position}, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`,
        }}
      />

      {/* Middle layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        const start = blurIndex * 12.5;
        const mid = (blurIndex + 1) * 12.5;
        const end = (blurIndex + 2) * 12.5;
        const mask = `linear-gradient(to ${position}, rgba(0,0,0,0) ${start}%, rgba(0,0,0,1) ${mid}%, rgba(0,0,0,1) ${end}%, rgba(0,0,0,0) ${end + 12.5}%)`;

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}

      {/* Last layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage: `linear-gradient(to ${position}, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`,
          WebkitMaskImage: `linear-gradient(to ${position}, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`,
        }}
      />
    </div>
  );
}