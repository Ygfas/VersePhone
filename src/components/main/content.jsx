import React, { useMemo } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { WobbleCard } from "../ui/wobble-card";
import { MediaModal } from "../ui/media-modal";
import FramerDraggableCarousel from "../ui/carousel";
import { DiaTextReveal } from "../ui/dia-text-reveal";
import SpotlightCard from "../ui/SpotlightCard";


/**
 * Optimasi 1: React.memo pada CardContent
 * Mencegah render ulang modal content jika props tidak berubah.
 */
const CardContent = React.memo(({ title, description, image }) => {
    return (
        <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <div className="max-w-3xl mx-auto">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans mb-6">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        {title}
                    </span>
                    <br />
                    {description}
                </p>
                <img
                    src={image}
                    alt={title}
                    loading="lazy" // Optimasi: Lazy load gambar modal
                    decoding="async"
                    className="w-full h-auto mx-auto object-contain rounded-xl shadow-sm"
                />
            </div>
        </div>
    );
});

CardContent.displayName = "CardContent";

const data = [
    {
        category: "Artificial Intelligence",
        title: "You can do more with AI.",
        description: "Mulai dari otomatisasi tugas hingga pembuatan konten kreatif, AI membantu Anda melampaui batas produktivitas tradisional.",
        src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop",
        content: (
            <CardContent
                title="You can do more with AI."
                description="Mulai dari otomatisasi tugas hingga pembuatan konten kreatif, AI membantu Anda melampaui batas produktivitas tradisional."
                image="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop"
            />
        ),
    },
    {
        category: "Productivity",
        title: "Enhance your workflow.",
        description: "Optimalkan waktu Anda dengan alat yang dirancang untuk fokus dan efisiensi tingkat tinggi.",
        src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop",
        content: (
            <CardContent
                title="Enhance your workflow."
                description="Optimalkan waktu Anda dengan alat yang dirancang untuk fokus dan efisiensi tingkat tinggi."
                image="https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop"
            />
        ),
    },
    {
        category: "Product",
        title: "Apple Vision Pro.",
        description: "Masuki dunia komputasi spasial di mana konten digital menyatu sempurna dengan ruang fisik Anda.",
        src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop",
        content: (
            <CardContent
                title="Apple Vision Pro."
                description="Masuki dunia komputasi spasial di mana konten digital menyatu sempurna dengan ruang fisik Anda."
                image="https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop"
            />
        ),
    },
    {
        category: "iOS",
        title: "Photography redefined.",
        description: "Abadikan setiap momen dengan detail luar biasa menggunakan sistem kamera paling canggih.",
        src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop",
        content: (
            <CardContent
                title="Photography redefined."
                description="Abadikan setiap momen dengan detail luar biasa menggunakan sistem kamera paling canggih."
                image="https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop"
            />
        ),
    },
    {
        category: "Creative",
        title: "Design with precision.",
        description: "Alat yang memungkinkan Anda mewujudkan ide paling kompleks dengan kemudahan luar biasa.",
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2526&auto=format&fit=crop",
        content: (
            <CardContent
                title="Design with precision."
                description="Alat yang memungkinkan Anda mewujudkan ide paling kompleks dengan kemudahan luar biasa."
                image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2526&auto=format&fit=crop"
            />
        ),
    },
    {
        category: "System",
        title: "Performance at core.",
        description: "Arsitektur sistem yang dirancang untuk kecepatan tanpa kompromi pada daya tahan.",
        src: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop",
        content: (
            <CardContent
                title="Performance at core."
                description="Arsitektur sistem yang dirancang untuk kecepatan tanpa kompromi pada daya tahan."
                image="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop"
            />
        ),
    },
];

export default function Content() {
    /**
     * Optimasi 2: useMemo untuk Carousel Cards
     * Mencegah array cards dibuat ulang setiap kali komponen Content render ulang.
     */
    const cards = useMemo(() => data.map((card, index) => (
        <Card key={index} card={card} index={index} />
    )), []);

    return (
        <div className="w-[92%] md:w-[95%] mx-auto space-y-8 pt-10">
            <header>
                <div className="flex min-h-45 items-center justify-center pt-10 ">
                    <DiaTextReveal
                        className="text-5xl font-bold tracking-tight"
                        colors={["#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"]}
                        delay={0.35}
                        duration={2.4}
                        text="Artikel Terbaru "
                        once={true} // Ini kuncinya agar tidak reset saat scroll
                        startOnView={true}
                    />


                </div>
            </header>

            <section className="w-full">
                <Carousel items={cards} />
            </section>

            <section className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
                <div className="flex-1 min-w-[350px]">
                    <FramerDraggableCarousel />
                </div>

                <div className="flex-1 min-w-[350px]">
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <MediaModal
                            videoSrc={
                                '/video/vivo.mp4'
                            }
                        />
                        <MediaModal
                            videoSrc={
                                '/video/samsung.mp4'
                            }
                        />
                        <MediaModal
                            videoSrc={
                                '/video/apple.mp4'
                            }
                        />
                        <MediaModal
                            videoSrc={
                                '/video/xiaomi.mp4'
                            }
                        />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                {/* Optimasi 4: Hardware Acceleration with will-change-transform di CSS jika diperlukan */}
                <SpotlightCard className=" min-h-[500px] lg:min-h-[300px] col-span-1 lg:col-span-2 " spotlightColor="rgba(0, 229, 255, 0.2)">
                    <WobbleCard containerClassName="h-full bg-black/20 ">

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
                <SpotlightCard className='col-span-1 min-h-[300px]' spotlightColor="rgba(0, 229, 255, 0.2) ">

                    <WobbleCard containerClassName="h-full bg-black/20 ">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] darK:text-white teks-black">
                            No shirt, no shoes, no weapons.
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 dark:text-neutral-200 teks-neutral-800">
                            If someone yells “stop!”, the fight is over.
                        </p>
                    </WobbleCard>
                </SpotlightCard>
                <SpotlightCard className='col-span-1 lg:col-span-3 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]' spotlightColor="rgba(0, 229, 255, 0.2) "> 

                    <WobbleCard containerClassName="h-full bg-black/20" >
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