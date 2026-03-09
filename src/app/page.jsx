'use client'
import Image from "next/image";
import Navbar from "@/main/navbar";
import { InteractiveFooter } from "@/main/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import Hero from "@/main/hero";





export default function Home() {
 

  return (
    <>
      {/* Navbar dan ScrollProgress harus sejajar, bukan di dalam pembungkus konten */}
      <Navbar />
      
      <ScrollProgress className="fixed top-0 left-0 right-0 z-[6000]" />

      <div className="relative w-full">
        {/* Konten Utama Disini */}
        <div className="h-[2500px]">
          <Hero />
         
        </div>
      </div>
      <InteractiveFooter />
      
    </>
  );
}
