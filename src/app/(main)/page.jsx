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
          <div className="sm:h-[4700px]  xl:h-[4800px] 2xl:h-[5000px] h-[4500px]">
           
            <Hero />
            <Content />

          </div>


    </>
  );
}
