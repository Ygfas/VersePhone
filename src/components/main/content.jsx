'use client'
import React, { useState, useEffect, useMemo } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { WobbleCard } from "../ui/wobble-card";
import { MediaModal } from "../ui/media-modal";
import FramerDraggableCarousel from "../ui/carousel";
import { DiaTextReveal } from "../ui/dia-text-reveal";
import SpotlightCard from "../ui/SpotlightCard";
import Image from "next/image";
import Link from "next/link";

// --- CardContent tetap sama ---
const CardContent = React.memo(({ title, description, image, source }) => {
    return (
        <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <div className="max-w-3xl mx-auto">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans mb-6">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">{title}</span>
                    <br />

                </p>
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        width={900}
                        height={500}
                        className="w-full h-auto mx-auto object-cover rounded-xl shadow-sm"
                    />
                )}
                {description}

            </div>
            <div className="font-bold mt-20">

               Sumber
                <h1 className='text-blue-500 '>
               {source}
               </h1>
            </div>
        </div>
    );
});
CardContent.displayName = "CardContent";

export default function Content() {
    const [artikelList, setArtikelList] = useState([]);

    // 1. Fetch data dari API
    useEffect(() => {
        fetch('/api/artikel')
            .then((res) => res.json())
            .then((data) => setArtikelList(data))
            .catch((err) => console.error("Error fetching:", err));
    }, []);


    const cards = useMemo(() => {
        return artikelList.map((item, index) => ({
            category: "Artikel Terbaru",
            title: item.judul,
            description: item.konten.substring(0, 100) + "...",
            src: item.gambar_artikel,
            source: item.sumber,
            content: (
                <CardContent
                    title={item.judul}
                    description={item.konten}
                    image={item.gambar_artikel}
                    source={item.sumber}
                />
            ),
        })).map((card, index) => (
            <Card key={index} card={card} index={index} />
        ));
    }, [artikelList]);

    return (
        <div className="w-[92%] md:w-[95%] mx-auto space-y-8 pt-10">
            {/* Header */}
            <header>
                <div className="flex min-h-45 items-center justify-center pt-10">
                    <DiaTextReveal
                        className="text-5xl font-bold tracking-tight"
                        text="Artikel Terbaru"
                    />
                </div>
            </header>

            {/* Carousel Artikel Dinamis */}
            <section className="w-full">
                {artikelList.length > 0 ? (
                    <Carousel items={cards} />
                ) : (
                    <p className="text-center">Memuat artikel...</p>
                )}
            </section>

            {/* Bagian Bawah tetap sama... */}
            <section className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
                <div className="flex-1 min-w-[350px]"><FramerDraggableCarousel /></div>
                <div className="flex-1 min-w-[350px]">
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <MediaModal videoSrc={'/video/vivo.mp4'} />
                        <MediaModal videoSrc={'/video/samsung.mp4'} />
                        <MediaModal videoSrc={'/video/apple.mp4'} />
                        <MediaModal videoSrc={'/video/xiaomi.mp4'} />
                    </div>
                </div>
            </section>


            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                {/* Optimasi 4: Hardware Acceleration with will-change-transform di CSS jika diperlukan */}
                <SpotlightCard className=" min-h-[500px] lg:min-h-[300px] col-span-1 lg:col-span-2 flex flex-wrap items-center " spotlightColor="rgba(0, 229, 255, 0.2)">
                    <img src="/thumbnail/ip.jpg" alt="" className="bg-cover h-[60%] mx-auto" />

                    <WobbleCard containerClassName="h-[40%] bg-black/20 ">


                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] dark:text-white teks-black">
                                Gippity AI powers the entire universe
                            </h2>
                            <p className="mt-4 text-left text-base/6 dark:text-neutral-200 teks-neutral-800">
                                With over 100,000 monthly active bot users.
                            </p>
                        </div>


                    </WobbleCard>
                </SpotlightCard>
                <SpotlightCard className='col-span-1 min-h-[300px] flex flex-wrap' spotlightColor="rgba(0, 229, 255, 0.2) ">
                    <img src="/thumbnail/vivo.jpg" alt="" className="bg-cover h-[60%]" />
                    <WobbleCard containerClassName="h-[40%] bg-black/20 ">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] darK:text-white teks-black">
                            No shirt, no shoes, no weapons.
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 dark:text-neutral-200 teks-neutral-800">
                            If someone yells “stop!”, the fight is over.
                        </p>
                    </WobbleCard>

                </SpotlightCard>
                <SpotlightCard className='col-span-1 lg:col-span-3 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] flex' spotlightColor="rgba(0, 229, 255, 0.2) ">\
                    <img src="/thumbnail/xiaomi1.jpg" alt="" className="bg-cover ha-[60%]:" />

                    <WobbleCard containerClassName="h-40% bg-black/20" >
                        <div className="max-w-sm">
                            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] darK:text-white teks-black">
                                Blazing-fast Gippity AI wrapper today!
                            </h2>
                        </div>

                    </WobbleCard>
                </SpotlightCard>


            </section>
        </div>
    );
}