import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { WobbleCard } from "../ui/wobble-card";
import { MediaModal } from "../ui/media-modal";
import FramerDraggableCarousel from "../ui/carousel";

/**
 * Komponen Konten yang Muncul Saat Kartu Diklik
 * Properti title, description, dan image sekarang dinamis
 */
const CardContent = ({ title, description, image }) => {
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
                    className="w-full h-auto mx-auto object-contain rounded-xl shadow-sm"
                />
            </div>
        </div>
    );
};

// Data yang telah disinkronkan: Isi content sama dengan data sampul
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
    const cards = data.map((card, index) => (
        <Card key={index} card={card} index={index} />
    ));

    return (
        <div className="w-[92%] md:w-[95%] mx-auto py-20 space-y-16">

            <header>
                <h2 className="text-2xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans tracking-tight">
                    Get to know your iSad.
                </h2>
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
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="w-full aspect-video rounded-3xl overflow-hidden shadow-md">
                                <MediaModal
                                    videoSrc="https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                >
                    <div className="max-w-xs">
                        <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Gippity AI powers the entire universe
                        </h2>
                        <p className="mt-4 text-left text-base/6 text-neutral-200">
                            With over 100,000 monthly active bot users, Gippity AI is the most
                            popular AI platform for developers.
                        </p>
                    </div>
                    <img
                        src="/linear.webp"
                        alt="linear demo"
                        className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl w-[500px]"
                    />
                </WobbleCard>

                <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-zinc-900">
                    <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                        No shirt, no shoes, no weapons.
                    </h2>
                    <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                        If someone yells “stop!”, goes limp, or taps out, the fight is over.
                    </p>
                </WobbleCard>

                <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                    <div className="max-w-sm">
                        <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Blazing-fast Gippity AI wrapper today!
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                            The most advanced integration for your daily development workflow.
                        </p>
                    </div>
                    <img
                        src="/linear.webp"
                        alt="linear demo"
                        className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl w-[500px]"
                    />
                </WobbleCard>
            </section>
        </div>
    );
}