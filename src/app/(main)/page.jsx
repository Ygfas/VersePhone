'use client'
import Image from "next/image";
import Navbar from "@/components/main/navbar";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import Hero from "@/components/main/hero";
import Content from "@/components/main/content";






export default function Home() {


  return (
    <>
      {/* Navbar dan ScrollProgress harus sejajar, bukan di dalam pembungkus konten */}


      <ScrollProgress className="fixed top-0 left-0 right-0 z-[5000]" />

      <div className="relative w-full">
       
      </div>
          <div className="h-[2500px]">
           
            <Hero />
            <Content />



          </div>


    </>
  );
}
