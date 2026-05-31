'use client'
import Image from "next/image";
import Navbar from "@/components/main/navbar";
import Hero from "@/components/main/hero";
import Content from "@/components/main/content";






export default function Home() {


  return (
    <>
      {/* Navbar dan ScrollProgress harus sejajar, bukan di dalam pembungkus konten */}


   

      <div className="relative w-full">
       
      </div>
          <div className="sm:h-[4600px]  xl:h-[4600px] 2xl:h-[4800px] h-[4300px]">
           
            <Hero />
            <Content />

          </div>


    </>
  );
}
